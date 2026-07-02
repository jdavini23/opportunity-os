"""OpportunityOS backend configuration.

All settings come from environment variables (see .env.example). Security
posture is fail-closed: missing keys disable features with loud startup
warnings rather than falling back to known-weak defaults.
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("opportunity_os")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip()
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5").strip()
if not ANTHROPIC_API_KEY:
    logger.warning(
        "ANTHROPIC_API_KEY not set — report generation will return 500 for every "
        "request. Set ANTHROPIC_API_KEY to enable it."
    )

# CORS: never combine wildcard origins with credentials. Fail closed when unset.
_cors_env = os.environ.get("CORS_ORIGINS", "").strip()
if _cors_env and _cors_env != "*":
    CORS_ORIGINS = [o.strip() for o in _cors_env.split(",") if o.strip()]
else:
    CORS_ORIGINS = []
    logger.warning(
        "CORS_ORIGINS not set to explicit origins — cross-origin requests are "
        "disabled. Set CORS_ORIGINS to your frontend origin(s)."
    )

# Rate limiting / cost protection. Report generation is an expensive LLM call
# with no paywall in front of it, so these caps are the only spend control.
RATE_LIMIT_IP_SALT = os.environ.get("RATE_LIMIT_IP_SALT", "").strip()
if not RATE_LIMIT_IP_SALT:
    logger.warning(
        "RATE_LIMIT_IP_SALT not set — IP hashes will use an empty salt. Set a "
        "random value so hashed IPs can't be reversed by rainbow lookup."
    )

MAX_REPORTS_PER_IP_PER_DAY = int(os.environ.get("MAX_REPORTS_PER_IP_PER_DAY", "15"))
MAX_REPORTS_PER_DAY_GLOBAL = int(os.environ.get("MAX_REPORTS_PER_DAY_GLOBAL", "200"))
REPORT_BURST_MAX = int(os.environ.get("REPORT_BURST_MAX", "3"))
REPORT_BURST_WINDOW_SECS = int(os.environ.get("REPORT_BURST_WINDOW_SECS", "600"))
