import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
// Demo mode: serve a canned sample report client-side so the app can be
// previewed on static hosting with no backend. Build-time flag.
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === "1";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

const demoGenerate = async (query) => {
  const { DEMO_REPORT } = await import("./demoReport");
  // Let the loading ticker breathe so the preview shows the real flow.
  await new Promise((r) => setTimeout(r, 3000));
  const report = {
    ...DEMO_REPORT,
    report_id: `rpt_demo${Math.random().toString(16).slice(2, 10)}`,
    query,
    created_at: new Date().toISOString(),
  };
  sessionStorage.setItem(`demo:${report.report_id}`, JSON.stringify(report));
  return { data: report };
};

const demoFetch = async (reportId) => {
  const stored = sessionStorage.getItem(`demo:${reportId}`);
  if (!stored) {
    const err = new Error("Not found");
    err.response = { status: 404 };
    throw err;
  }
  return { data: JSON.parse(stored) };
};

// Report generation is a long LLM call — give it its own generous timeout
// rather than raising the default for every request.
export const generateReport = (query) =>
  DEMO_MODE ? demoGenerate(query) : api.post("/reports", { query }, { timeout: 150_000 });

export const fetchReport = (reportId) =>
  DEMO_MODE ? demoFetch(reportId) : api.get(`/reports/${reportId}`);
