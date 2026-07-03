"""Report generation and retrieval endpoints."""

from fastapi import APIRouter, HTTPException, Request

from db import db
from integrations.anthropic_client import generate_opportunity_report
from models import OpportunityReport, ReportCreateRequest, compute_overall_score
from rate_limit import check_report_rate_limit, client_ip

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("")
async def create_report(body: ReportCreateRequest, request: Request):
    await check_report_rate_limit(client_ip(request))

    query = body.query.strip()
    llm_report, model_used = await generate_opportunity_report(query)

    report = OpportunityReport(
        query=query,
        overall_score=compute_overall_score(llm_report.score_breakdown),
        model=model_used,
        **llm_report.model_dump(),
    )
    doc = report.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.reports.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@router.get("/{report_id}")
async def get_report(report_id: str):
    doc = await db.reports.find_one({"report_id": report_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")
    return doc
