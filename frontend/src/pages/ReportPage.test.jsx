import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ReportPage from "./ReportPage";
import { fetchReport } from "@/lib/api";
import { DEMO_REPORT } from "@/lib/demoReport";

jest.mock("@/lib/api", () => ({
  generateReport: jest.fn(),
  fetchReport: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const SAMPLE_REPORT = {
  ...DEMO_REPORT,
  report_id: "rpt_sample123",
  query: "scheduling software for mobile dog groomers",
  created_at: "2026-07-01T12:00:00Z",
};

const renderReportPage = (reportId = SAMPLE_REPORT.report_id) =>
  render(
    <MemoryRouter initialEntries={[`/report/${reportId}`]}>
      <Routes>
        <Route path="/report/:reportId" element={<ReportPage />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

test("fetches and renders a shared report by id", async () => {
  fetchReport.mockResolvedValueOnce({ data: SAMPLE_REPORT });
  renderReportPage();

  expect(await screen.findByTestId("report-query-title")).toHaveTextContent(
    SAMPLE_REPORT.query,
  );
  expect(fetchReport).toHaveBeenCalledWith(SAMPLE_REPORT.report_id);
  expect(screen.getByTestId("report-overall-score")).toHaveTextContent(
    String(SAMPLE_REPORT.overall_score),
  );
  expect(screen.getByTestId("report-executive-summary")).toHaveTextContent(
    "Mobile dog groomers",
  );
  // One section per report field, all present.
  for (const testId of [
    "report-score-section",
    "report-customer-problems",
    "report-evidence",
    "report-market-analysis",
    "report-competitors",
    "report-recommended-mvp",
    "report-pricing",
    "report-gtm",
    "report-build-time",
  ]) {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  }
  expect(screen.getByTestId("report-disclaimer")).toHaveTextContent(
    SAMPLE_REPORT.disclaimer,
  );
});

test("shows the not-found state for an unknown report id", async () => {
  fetchReport.mockRejectedValueOnce({ response: { status: 404 } });
  renderReportPage("rpt_doesnotexist");

  const error = await screen.findByTestId("report-error");
  expect(error).toHaveTextContent("This report doesn't exist");
  expect(screen.getByTestId("report-error-back")).toHaveAttribute("href", "/");
});

test("shows a connection error for non-404 failures", async () => {
  fetchReport.mockRejectedValueOnce(new Error("network down"));
  renderReportPage();

  const error = await screen.findByTestId("report-error");
  expect(error).toHaveTextContent("Failed to load the report");
});
