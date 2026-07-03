"""Direct Anthropic SDK integration for opportunity report generation.

Uses the official async client with structured outputs (messages.parse +
output_format=<Pydantic model>), so the response is a validated
OpportunityReportLLM instance — never free text parsed by regex.

Each external integration in this codebase is its own thin module using its
own official SDK. There is deliberately no shared vendor/proxy layer, so
swapping models here — or adding Stripe/OAuth elsewhere later — stays local
to one file.
"""

import logging

import anthropic
from anthropic import AsyncAnthropic
from fastapi import HTTPException

from config import ANTHROPIC_API_KEY, ANTHROPIC_MODEL
from models import OpportunityReportLLM

logger = logging.getLogger("opportunity_os.anthropic")

# 120s keeps the whole request under the frontend's 150s deadline
# (frontend/src/lib/api.js), so the server never "succeeds" after the
# client has already given up.
_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY, timeout=120.0) if ANTHROPIC_API_KEY else None

REPORT_SYSTEM_PROMPT = """\
You are the analysis engine behind OpportunityOS, a market-intelligence tool \
for founders. Given a search query describing an industry, niche, or customer \
type, produce a structured, evidence-reasoned business-opportunity report.

Rules:
- Reason from your training knowledge. You do NOT have live web or search \
access in this call — never claim to have just looked something up, and never \
invent specific recent statistics, named funding rounds, or dated news you \
cannot be confident of. Where you are inferring from general patterns rather \
than a specific known fact, tag the evidence point accordingly.
- Be brutally honest, not promotional. If an opportunity is weak, say why and \
score it low. Founders lose months building the wrong thing; your job is to \
prevent that.
- Every score dimension is FAVORABILITY for a new solo/small-team entrant: \
100 is always good. competition=100 means wide open with no strong incumbents; \
build_complexity=100 means a trivial MVP buildable in days.
- Ground every score in the qualitative sections: a customer_pain of 90 must \
be traceable to specific problems you named in customer_problems.
- In competitor analysis, name real players or categories you are reasonably \
confident exist. Never fabricate specific company names.
- Keep prose concise and scannable. This is read by builders deciding whether \
to spend the next three months on this, not a term paper.
"""


async def generate_opportunity_report(query: str) -> tuple[OpportunityReportLLM, str]:
    """Returns (validated report, model id used). Raises HTTPException on failure."""
    if _client is None:
        raise HTTPException(status_code=500, detail="Report generation is not configured.")

    try:
        response = await _client.messages.parse(
            model=ANTHROPIC_MODEL,
            max_tokens=8000,
            system=REPORT_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Generate an opportunity report for this query: {query}",
                }
            ],
            output_format=OpportunityReportLLM,
            output_config={"effort": "high"},
        )
    except anthropic.RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="The AI provider is rate-limited right now — try again in a minute.",
        )
    except anthropic.APIConnectionError:
        raise HTTPException(status_code=502, detail="Could not reach the AI provider.")
    except anthropic.APIStatusError as e:
        logger.exception("Anthropic API error for query=%r", query)
        raise HTTPException(status_code=502, detail="AI provider error — please try again.") from e

    if response.stop_reason == "refusal":
        raise HTTPException(
            status_code=422,
            detail=(
                "Couldn't generate a report for this query — try rephrasing it as "
                "an industry, niche, or customer type."
            ),
        )
    if response.stop_reason == "max_tokens" or response.parsed_output is None:
        logger.warning("Report truncated or unparsable for query=%r (stop_reason=%s)", query, response.stop_reason)
        raise HTTPException(status_code=502, detail="Report generation was incomplete — please try again.")

    return response.parsed_output, ANTHROPIC_MODEL
