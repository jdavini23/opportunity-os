// Sample report served in demo mode (REACT_APP_DEMO_MODE=1) — lets the app be
// previewed end-to-end on static hosting with no backend or API key.
export const DEMO_REPORT = {
  executive_summary:
    "Mobile dog groomers are a fragmented, underserved trade with real scheduling pain and almost no purpose-built software. The opportunity is strong on pain and openness, moderate on revenue ceiling. A focused scheduling-plus-routing MVP is buildable in weeks and can win through trade communities.",
  customer_problems: [
    { problem: "Double-bookings and route chaos from managing appointments in paper calendars and texts", severity: "high" },
    { problem: "No-shows without deposits eat 10-20% of weekly revenue", severity: "high" },
    { problem: "Generic salon software assumes a fixed location and ignores drive time", severity: "medium" },
  ],
  evidence: [
    { point: "Trade forums consistently discuss scheduling and no-show pain as top operational complaints", basis: "known_industry_pattern" },
    { point: "Mobile service businesses with drive-time constraints are poorly served by fixed-location booking tools", basis: "reasoning" },
    { point: "Individual groomers report paying for 2-3 disconnected tools to cover booking, payments, and reminders", basis: "anecdotal_signal" },
  ],
  score_breakdown: {
    customer_pain: 85,
    demand: 70,
    competition: 75,
    revenue_potential: 55,
    trend_growth: 65,
    build_complexity: 80,
    ai_confidence: 70,
  },
  market_analysis:
    "The mobile grooming segment has grown alongside pet-spend generally, and its operators are solo or 2-3 van businesses. They buy simple, cheap tools that save hours, not platforms. Willingness to pay clusters around $30-80/month when the tool visibly reduces no-shows and drive time.",
  competitor_analysis: [
    { name: "Generic salon booking suites", description: "Fixed-location booking tools retrofitted for mobile use", weakness: "No routing or drive-time awareness; mobile workflows are an afterthought" },
    { name: "Horizontal scheduling tools", description: "Calendly-style booking pages", weakness: "No deposits, routing, or pet/vaccination records" },
  ],
  recommended_mvp:
    "A one-screen day view that combines appointments with drive-time gaps, deposit-backed booking links, and automated SMS reminders. Skip inventory, payroll, and marketing features entirely.",
  pricing_recommendation: "$49/month flat per van, 14-day free trial, no per-booking fees.",
  go_to_market_plan:
    "Go direct into groomer Facebook groups and trade associations with a no-show-cost calculator as the hook. Partner with van outfitters and grooming schools for distribution. Aim for 10 paying vans in 60 days.",
  build_time_estimate: "4-6 weeks",
  overall_score: 73,
  model: "demo-preview",
  disclaimer:
    "This is a static sample report shown in demo mode — the live product generates a fresh, query-specific report with Claude. Verify demand and competition independently before building.",
};
