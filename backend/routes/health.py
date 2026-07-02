"""Liveness and DB reachability probe."""

from fastapi import APIRouter, HTTPException

from db import db

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health_check():
    try:
        await db.command("ping")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {e}")
    return {"status": "ok"}
