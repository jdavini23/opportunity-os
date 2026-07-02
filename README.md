# OpportunityOS

**Find the next software business worth building.**

Search any industry, niche, or customer type and get a brutally honest, AI-generated
opportunity report: customer pain, evidence (tagged by basis), a weighted 7-dimension
Opportunity Score, market and competitor analysis, a recommended MVP, pricing, and a
go-to-market plan. Every report gets a permanent shareable URL.

## Stack

- **Backend** — FastAPI + MongoDB (Motor) + the official Anthropic SDK
  (structured outputs via `messages.parse`, no free-text parsing)
- **Frontend** — React 19 (CRA + craco) + Tailwind + shadcn/ui, strict
  black-and-white design system (see `design_guidelines.md`)

## Local development

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # fill in ANTHROPIC_API_KEY and MONGO_URL
uvicorn server:app --reload --port 8000
```

Requires a running MongoDB (local `mongod` or an Atlas connection string).

Smoke test:

```bash
curl http://localhost:8000/api/health
curl -X POST http://localhost:8000/api/reports \
  -H 'Content-Type: application/json' \
  -d '{"query": "AI tools for HVAC contractors"}'
```

Run the test suite (no Mongo or API key needed — uses an in-process mock):

```bash
pip install pytest httpx mongomock-motor
python -m pytest tests/
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # REACT_APP_BACKEND_URL=http://localhost:8000
npm start
```

## Deployment

| Piece    | Target                | Notes                                                        |
| -------- | --------------------- | ------------------------------------------------------------ |
| Backend  | Railway (or Render)   | Auto-detects `backend/Dockerfile`; set env vars from `.env.example` |
| Database | MongoDB Atlas (M0)    | Set `MONGO_URL` on the backend host                          |
| Frontend | Vercel                | Root directory `frontend/`; set `REACT_APP_BACKEND_URL`      |

After deploying, set `CORS_ORIGINS` on the backend to the deployed frontend origin.

## Environment variables

Backend (`backend/.env.example`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | Report generation (Claude) |
| `MONGO_URL`, `DB_NAME` | yes | MongoDB connection |
| `CORS_ORIGINS` | prod | Comma-separated frontend origin(s); cross-origin disabled when unset |
| `RATE_LIMIT_IP_SALT` | recommended | Salts hashed IPs used as rate-limit keys |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-sonnet-5` |
| `MAX_REPORTS_PER_IP_PER_DAY` | no | Default 15 |
| `MAX_REPORTS_PER_DAY_GLOBAL` | no | Default 200 — the global LLM spend backstop |
| `REPORT_BURST_MAX` / `REPORT_BURST_WINDOW_SECS` | no | Default 3 per 600s per IP |

Frontend: `REACT_APP_BACKEND_URL` — the deployed backend URL (no trailing slash).

## Cost protection

There is no auth or paywall in v1, so three rate-limit layers gate LLM spend:
a per-IP burst limiter (in-memory), a per-IP daily cap, and a global daily cap
(both Mongo-backed and restart-safe). IPs are salted-and-hashed, never stored raw.

## Design system

Strict monochrome (black/white/gray only), Geist for prose, Geist Mono for data
points only, kebab-case `data-testid` on every interactive/informational element.
`design_guidelines.md` is the source of truth.
