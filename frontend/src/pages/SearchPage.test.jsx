import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import SearchPage from "./SearchPage";
import { generateReport } from "@/lib/api";
import { toast } from "sonner";

jest.mock("@/lib/api", () => ({
  generateReport: jest.fn(),
  fetchReport: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-probe">{location.pathname}</div>;
}

const renderSearchPage = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/report/:reportId" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

test("renders the headline, input, and example queries", () => {
  renderSearchPage();
  expect(screen.getByTestId("search-headline")).toHaveTextContent(
    "Find the next software business worth building.",
  );
  expect(screen.getByTestId("opportunity-search-input")).toBeInTheDocument();
  expect(screen.getByTestId("opportunity-search-button")).toBeInTheDocument();
  expect(screen.getAllByTestId("search-example-chip").length).toBeGreaterThan(0);
});

test("rejects queries under 3 characters without calling the API", async () => {
  const user = userEvent.setup();
  renderSearchPage();
  await user.type(screen.getByTestId("opportunity-search-input"), "ab");
  await user.click(screen.getByTestId("opportunity-search-button"));
  expect(toast.error).toHaveBeenCalledWith(
    expect.stringContaining("at least 3 characters"),
  );
  expect(generateReport).not.toHaveBeenCalled();
});

test("navigates to the report page after a successful generation", async () => {
  generateReport.mockResolvedValueOnce({
    data: { report_id: "rpt_test123456", query: "AI tools for HVAC contractors" },
  });
  const user = userEvent.setup();
  renderSearchPage();
  await user.type(
    screen.getByTestId("opportunity-search-input"),
    "AI tools for HVAC contractors",
  );
  await user.click(screen.getByTestId("opportunity-search-button"));
  expect(await screen.findByTestId("location-probe")).toHaveTextContent(
    "/report/rpt_test123456",
  );
  expect(generateReport).toHaveBeenCalledWith("AI tools for HVAC contractors");
});

test("surfaces the backend detail message on a 429 rate limit", async () => {
  generateReport.mockRejectedValueOnce({
    response: { status: 429, data: { detail: "You've hit today's report limit — try again tomorrow." } },
  });
  const user = userEvent.setup();
  renderSearchPage();
  await user.type(screen.getByTestId("opportunity-search-input"), "meal prep for powerlifters");
  await user.click(screen.getByTestId("opportunity-search-button"));
  expect(toast.error).toHaveBeenCalledWith(
    "You've hit today's report limit — try again tomorrow.",
  );
  // Back on the search page, not navigated away.
  expect(screen.getByTestId("opportunity-search-input")).toBeInTheDocument();
});
