import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReportSection } from "@/components/ReportSection";
import { ScoreBreakdownGrid } from "@/components/ScoreBreakdownGrid";
import { CompetitorCard } from "@/components/CompetitorCard";
import { fetchReport } from "@/lib/api";
import { toast } from "sonner";
import { AlertCircle, Link2 } from "lucide-react";

const SEVERITY_LABEL = { low: "LOW", medium: "MED", high: "HIGH" };
const BASIS_LABEL = {
  reasoning: "REASONING",
  known_industry_pattern: "KNOWN PATTERN",
  anecdotal_signal: "ANECDOTAL",
};

function ReportSkeleton() {
  return (
    <div className="py-10">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-10 w-3/4 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-[12px]" />
        ))}
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export default function ReportPage() {
  const { reportId } = useParams();
  const location = useLocation();
  // Fast path: report passed via router state from the search flow.
  // Fallback: direct link / refresh / share fetches by id (never regenerates).
  const [report, setReport] = useState(location.state?.report || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (report) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await fetchReport(reportId);
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.status === 404
              ? "This report doesn't exist — it may have been generated with a different link."
              : "Failed to load the report — check your connection and try again.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Report link copied — anyone can open it.");
    } catch {
      toast.error("Couldn't copy the link — copy it from the address bar.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div data-testid="report-error" className="py-24 text-center">
              <AlertCircle size={20} className="mx-auto mb-2 text-[hsl(var(--mn-fg-subtle))]" />
              <p className="text-sm font-mono text-[hsl(var(--mn-fg-subtle))] mb-4">{error}</p>
              <Link to="/" className="mn-link text-sm" data-testid="report-error-back">
                Generate a new report
              </Link>
            </div>
          ) : !report ? (
            <ReportSkeleton />
          ) : (
            <article className="py-10">
              {/* ------------------------------------------------ header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
                    OPPORTUNITY REPORT ·{" "}
                    {new Date(report.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <h1
                    data-testid="report-query-title"
                    className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-black leading-tight"
                  >
                    {report.query}
                  </h1>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    data-testid="report-overall-score"
                    className="rounded-[14px] border border-black px-4 py-2 text-center"
                  >
                    <div className="font-mono text-2xl sm:text-3xl font-semibold text-black leading-none">
                      {report.overall_score}
                    </div>
                    <div className="font-mono text-[9px] tracking-widest text-[hsl(var(--mn-fg-subtle))] mt-1">
                      SCORE /100
                    </div>
                  </div>
                  <Button
                    data-testid="report-share-button"
                    onClick={handleShare}
                    variant="outline"
                    className="rounded-[12px] border-[hsl(var(--mn-border-strong))] hover:bg-[hsl(var(--mn-surface-2))]"
                  >
                    <Link2 size={14} className="mr-1.5" /> Share
                  </Button>
                </div>
              </div>

              {/* ------------------------------------------------ sections */}
              <ReportSection kicker="EXECUTIVE SUMMARY" testId="report-executive-summary">
                <p className="text-sm sm:text-base text-black leading-relaxed">
                  {report.executive_summary}
                </p>
              </ReportSection>

              <ReportSection kicker="OPPORTUNITY SCORE · 7 WEIGHTED DIMENSIONS" testId="report-score-section">
                <ScoreBreakdownGrid breakdown={report.score_breakdown} />
              </ReportSection>

              <ReportSection kicker="CUSTOMER PROBLEMS" testId="report-customer-problems">
                <ul className="space-y-2">
                  {report.customer_problems.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] tracking-widest border border-[hsl(var(--mn-border-strong))] rounded-[8px] px-1.5 py-0.5 mt-0.5 shrink-0">
                        {SEVERITY_LABEL[p.severity] || p.severity}
                      </span>
                      <span className="text-sm text-black leading-relaxed">{p.problem}</span>
                    </li>
                  ))}
                </ul>
              </ReportSection>

              <ReportSection kicker="EVIDENCE · TAGGED BY BASIS" testId="report-evidence">
                <ul className="space-y-2">
                  {report.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] tracking-widest border border-[hsl(var(--mn-border))] rounded-[8px] px-1.5 py-0.5 mt-0.5 shrink-0 text-[hsl(var(--mn-fg-subtle))]">
                        {BASIS_LABEL[e.basis] || e.basis}
                      </span>
                      <span className="text-sm text-black leading-relaxed">{e.point}</span>
                    </li>
                  ))}
                </ul>
              </ReportSection>

              <ReportSection kicker="MARKET ANALYSIS" testId="report-market-analysis">
                <p className="text-sm text-black leading-relaxed whitespace-pre-line">
                  {report.market_analysis}
                </p>
              </ReportSection>

              <ReportSection kicker="COMPETITOR ANALYSIS" testId="report-competitors">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.competitor_analysis.map((c, i) => (
                    <CompetitorCard key={i} competitor={c} />
                  ))}
                </div>
              </ReportSection>

              <ReportSection kicker="RECOMMENDED MVP" testId="report-recommended-mvp">
                <p className="text-sm text-black leading-relaxed whitespace-pre-line">
                  {report.recommended_mvp}
                </p>
              </ReportSection>

              <ReportSection kicker="PRICING RECOMMENDATION" testId="report-pricing">
                <p className="text-sm text-black leading-relaxed whitespace-pre-line">
                  {report.pricing_recommendation}
                </p>
              </ReportSection>

              <ReportSection kicker="GO-TO-MARKET PLAN" testId="report-gtm">
                <p className="text-sm text-black leading-relaxed whitespace-pre-line">
                  {report.go_to_market_plan}
                </p>
              </ReportSection>

              <ReportSection kicker="BUILD TIME ESTIMATE" testId="report-build-time">
                <span className="inline-block font-mono text-sm font-semibold border border-[hsl(var(--mn-border-strong))] rounded-[10px] px-3 py-1.5">
                  {report.build_time_estimate}
                </span>
              </ReportSection>

              {/* ------------------------------------------------ footer */}
              <div className="mt-4 pt-6 border-t border-[hsl(var(--mn-border))]">
                <p data-testid="report-disclaimer" className="text-xs text-[hsl(var(--mn-fg-subtle))] leading-relaxed">
                  {report.disclaimer}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Link to="/" className="mn-link text-sm" data-testid="report-new-search">
                    Run another search
                  </Link>
                  <span className="font-mono text-[10px] text-[hsl(var(--mn-fg-subtle))]">
                    {report.report_id} · {report.model}
                  </span>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
