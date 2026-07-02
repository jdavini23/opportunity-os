import React from "react";
import { MonoScoreMeter } from "@/components/MonoScoreMeter";

// Order and weights mirror the backend's SCORE_WEIGHTS — every dimension is
// favorability-framed (100 is always good for a new entrant).
const DIMENSIONS = [
  { key: "customer_pain", label: "Customer Pain", weight: "25%" },
  { key: "demand", label: "Demand", weight: "20%" },
  { key: "competition", label: "Competition", weight: "15%" },
  { key: "revenue_potential", label: "Revenue Potential", weight: "15%" },
  { key: "trend_growth", label: "Trend Growth", weight: "10%" },
  { key: "build_complexity", label: "Build Complexity", weight: "10%" },
  { key: "ai_confidence", label: "AI Confidence", weight: "5%" },
];

export const ScoreBreakdownGrid = ({ breakdown }) => (
  <div data-testid="report-score-breakdown" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {DIMENSIONS.map(({ key, label, weight }) => (
      <MonoScoreMeter
        key={key}
        label={`${label} · ${weight}`}
        value={breakdown[key]}
        testId={`report-score-${key.replace(/_/g, "-")}`}
      />
    ))}
  </div>
);
