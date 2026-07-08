"""API tests using an in-process Mongo mock and a stubbed LLM call.

These verify everything around the LLM: request validation, rate limiting,
deterministic scoring, persistence, and the shareable-fetch path. The real
Anthropic call is exercised by the deploy-time smoke test, not here.
"""

import pytest
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

import db as db_module
import rate_limit
import routes.health as health_routes
import routes.reports as report_routes
from models import (
    Competitor,
    CustomerProblem,
    EvidencePoint,
    OpportunityReportLLM,
    OpportunityScoreBreakdown,
    compute_overall_score,
)
from server import app

FAKE_LLM_REPORT = OpportunityReportLLM(
    executive_summary="A promising niche with real pain and light competition.",
    customer_problems=[CustomerProblem(problem="Manual scheduling wastes hours", severity="high")],
    evidence=[EvidencePoint(point="Service businesses consistently report scheduling pain", basis="known_industry_pattern")],
    score_breakdown=OpportunityScoreBreakdown(
        customer_pain=80, demand=70, competition=60,
        revenue_potential=50, trend_growth=90, build_complexity=40, ai_confidence=75,
    ),
    market_analysis="Fragmented market of small operators.",
    competitor_analysis=[Competitor(name="Legacy field-service suites", description="Enterprise-priced incumbents", weakness="Too heavy for solo operators")],
    recommended_mvp="A one-screen scheduling tool.",
    pricing_recommendation="$29/mo flat.",
    go_to_market_plan="Direct outreach in trade communities.",
    build_time_estimate="3-4 weeks",
)


@pytest.fixture()
def client(monkeypatch):
    mock_db = AsyncMongoMockClient()["opportunity_os_test"]
    monkeypatch.setattr(db_module, "db", mock_db)
    monkeypatch.setattr(report_routes, "db", mock_db)
    monkeypatch.setattr(health_routes, "db", mock_db)
    monkeypatch.setattr(rate_limit, "db", mock_db)
    rate_limit._burst.clear()

    async def fake_generate(query: str):
        return FAKE_LLM_REPORT, "claude-test"

    monkeypatch.setattr(report_routes, "generate_opportunity_report", fake_generate)
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_create_report_computes_weighted_score(client):
    r = client.post("/api/reports", json={"query": "AI tools for HVAC contractors"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["report_id"].startswith("rpt_")
    assert body["query"] == "AI tools for HVAC contractors"
    # 80*.25 + 70*.20 + 60*.15 + 50*.15 + 90*.10 + 40*.10 + 75*.05 = 67.25 -> 67
    assert body["overall_score"] == 67
    assert body["overall_score"] == compute_overall_score(FAKE_LLM_REPORT.score_breakdown)
    assert body["model"] == "claude-test"
    assert "disclaimer" in body
    assert "_id" not in body


def test_shareable_fetch_returns_identical_report(client):
    created = client.post("/api/reports", json={"query": "meal prep for powerlifters"}).json()
    fetched = client.get(f"/api/reports/{created['report_id']}")
    assert fetched.status_code == 200
    assert fetched.json() == created


def test_get_unknown_report_404s(client):
    assert client.get("/api/reports/rpt_doesnotexist").status_code == 404


def test_query_validation(client):
    assert client.post("/api/reports", json={"query": "ab"}).status_code == 422
    assert client.post("/api/reports", json={"query": "x" * 201}).status_code == 422


def test_burst_rate_limit(client, monkeypatch):
    monkeypatch.setattr(rate_limit, "REPORT_BURST_MAX", 2)
    ok1 = client.post("/api/reports", json={"query": "niche one query"})
    ok2 = client.post("/api/reports", json={"query": "niche two query"})
    limited = client.post("/api/reports", json={"query": "niche three query"})
    assert ok1.status_code == ok2.status_code == 200
    assert limited.status_code == 429


def test_daily_ip_cap(client, monkeypatch):
    monkeypatch.setattr(rate_limit, "MAX_REPORTS_PER_IP_PER_DAY", 1)
    assert client.post("/api/reports", json={"query": "first query today"}).status_code == 200
    r = client.post("/api/reports", json={"query": "second query today"})
    assert r.status_code == 429
    assert "today's report limit" in r.json()["detail"]


def test_global_daily_cap(client, monkeypatch):
    monkeypatch.setattr(rate_limit, "MAX_REPORTS_PER_DAY_GLOBAL", 1)
    assert client.post("/api/reports", json={"query": "first global query"}).status_code == 200
    assert client.post("/api/reports", json={"query": "second global query"}).status_code == 503


def test_proxy_header_ignored_by_default(client, monkeypatch):
    monkeypatch.setattr(rate_limit, "MAX_REPORTS_PER_IP_PER_DAY", 1)
    ok = client.post("/api/reports", json={"query": "first query today"},
                     headers={"X-Forwarded-For": "1.1.1.1"})
    limited = client.post("/api/reports", json={"query": "second query today"},
                          headers={"X-Forwarded-For": "2.2.2.2"})
    assert ok.status_code == 200
    # Header untrusted -> both requests land in the direct-connection bucket.
    assert limited.status_code == 429


def test_proxy_header_used_when_trusted(client, monkeypatch):
    monkeypatch.setattr(rate_limit, "TRUST_PROXY_HEADERS", True)
    monkeypatch.setattr(rate_limit, "MAX_REPORTS_PER_IP_PER_DAY", 1)
    ok1 = client.post("/api/reports", json={"query": "first query today"},
                      headers={"X-Forwarded-For": "1.1.1.1"})
    ok2 = client.post("/api/reports", json={"query": "second query today"},
                      headers={"X-Forwarded-For": "2.2.2.2"})
    limited = client.post("/api/reports", json={"query": "third query today"},
                          headers={"X-Forwarded-For": "2.2.2.2"})
    assert ok1.status_code == 200
    assert ok2.status_code == 200
    assert limited.status_code == 429


def test_proxy_header_spoofed_prefix_is_ignored(client, monkeypatch):
    monkeypatch.setattr(rate_limit, "TRUST_PROXY_HEADERS", True)
    monkeypatch.setattr(rate_limit, "MAX_REPORTS_PER_IP_PER_DAY", 1)
    # Only the last entry (appended by the trusted proxy) counts, so a
    # client-supplied prefix can't dodge the per-IP cap.
    ok = client.post("/api/reports", json={"query": "first query today"},
                     headers={"X-Forwarded-For": "9.9.9.9, 3.3.3.3"})
    limited = client.post("/api/reports", json={"query": "second query today"},
                          headers={"X-Forwarded-For": "8.8.8.8, 3.3.3.3"})
    assert ok.status_code == 200
    assert limited.status_code == 429
