import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Report generation is a long LLM call — give it its own generous timeout
// rather than raising the default for every request.
export const generateReport = (query) =>
  api.post("/reports", { query }, { timeout: 150_000 });

export const fetchReport = (reportId) => api.get(`/reports/${reportId}`);
