"""Rate limiting / cost protection for report generation.

Three layers, checked cheapest-first before any LLM call:
  1. Global daily cap (Mongo) — backstop against distributed abuse across IPs.
  2. Per-IP daily cap (Mongo) — survives restarts and multi-instance deploys.
  3. Per-IP burst limiter (in-memory sliding window) — smooths short spikes.

IPs are never stored raw: they are salted-and-hashed before being used as keys.
Counters increment on attempt (not success), so failed generations still
consume quota — the safe direction for spend control.
"""

import hashlib
import time
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict, List

from fastapi import HTTPException, Request
from pymongo import ReturnDocument

from config import (
    MAX_REPORTS_PER_DAY_GLOBAL,
    MAX_REPORTS_PER_IP_PER_DAY,
    RATE_LIMIT_IP_SALT,
    REPORT_BURST_MAX,
    REPORT_BURST_WINDOW_SECS,
    TRUST_PROXY_HEADERS,
)
from db import db

_burst: Dict[str, List[float]] = defaultdict(list)
_BURST_MAX_KEYS = 10_000


def client_ip(request: Request) -> str:
    """Client IP for rate-limit keys. Behind a reverse proxy the direct peer is
    the proxy, so when TRUST_PROXY_HEADERS is enabled use X-Forwarded-For
    instead — specifically its LAST entry, which is the one appended by the
    trusted proxy directly in front of us and can't be spoofed by the client
    (earlier entries are client-supplied)."""
    if TRUST_PROXY_HEADERS:
        forwarded = request.headers.get("x-forwarded-for", "")
        if forwarded:
            return forwarded.rsplit(",", 1)[-1].strip()
    return request.client.host if request.client else "unknown"


def _hash_ip(ip: str) -> str:
    return hashlib.sha256((ip + RATE_LIMIT_IP_SALT).encode()).hexdigest()[:24]


def _check_burst(key: str, max_requests: int, window_secs: int) -> bool:
    """Sliding-window in-memory limiter. Returns False when the caller exceeds
    max_requests within window_secs. Not perfectly atomic under async
    concurrency, but accurate enough for burst smoothing."""
    now = time.time()
    cutoff = now - window_secs

    if len(_burst) > _BURST_MAX_KEYS:
        dead = [k for k, ts in _burst.items() if not any(t > cutoff for t in ts)]
        for k in dead:
            del _burst[k]

    _burst[key] = [t for t in _burst[key] if t > cutoff]
    if len(_burst[key]) >= max_requests:
        return False
    _burst[key].append(now)
    return True


async def check_report_rate_limit(ip: str) -> None:
    """Raises HTTPException (429/503) when any layer is exceeded."""
    ip_hash = _hash_ip(ip)
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    # Consumed by the TTL indexes in db.ensure_indexes so daily counters
    # don't accumulate forever.
    expires_at = now + timedelta(days=2)

    global_doc = await db.usage_daily.find_one_and_update(
        {"_id": today},
        {"$inc": {"report_count": 1}, "$set": {"expires_at": expires_at}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    if global_doc["report_count"] > MAX_REPORTS_PER_DAY_GLOBAL:
        raise HTTPException(
            status_code=503,
            detail="OpportunityOS has hit today's global report limit — try again tomorrow.",
        )

    per_ip_doc = await db.rate_limit_daily.find_one_and_update(
        {"_id": f"{ip_hash}:{today}"},
        {"$inc": {"count": 1}, "$set": {"updated_at": now.isoformat(), "expires_at": expires_at}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    if per_ip_doc["count"] > MAX_REPORTS_PER_IP_PER_DAY:
        raise HTTPException(
            status_code=429,
            detail="You've hit today's report limit — try again tomorrow.",
        )

    if not _check_burst(f"report:{ip_hash}", REPORT_BURST_MAX, REPORT_BURST_WINDOW_SECS):
        raise HTTPException(
            status_code=429,
            detail="Too many requests — wait a few minutes and try again.",
        )
