"""OpportunityOS — FastAPI backend.

Endpoints:
    POST /api/reports              - generate an opportunity report for a query
    GET  /api/reports/{report_id}  - fetch a stored report (shareable, never regenerates)
    GET  /api/health               - liveness + DB ping probe
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

import db
from config import CORS_ORIGINS
from routes.health import router as health_router
from routes.reports import router as reports_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.ensure_indexes()
    yield
    db.close()


app = FastAPI(title="OpportunityOS API", lifespan=lifespan)
app.include_router(reports_router)
app.include_router(health_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
