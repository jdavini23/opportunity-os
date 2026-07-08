"""Liveness and DB reachability probe."""

import logging

from fastapi import APIRouter, HTTPException

from db import db

router = APIRouter(tags=["health"])
logger = logging.getLogger("opportunity_os.health")


@router.get("/api/health")
async def health_check():
    try:
        await db.command("ping")
    except Exception:
        # Log the real error server-side; Mongo exceptions can include
        # hostnames/topology details that don't belong in a public response.
        logger.exception("Database ping failed")
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {"status": "ok"}
