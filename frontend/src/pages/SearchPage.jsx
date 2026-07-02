import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingTicker } from "@/components/LoadingTicker";
import { generateReport } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const EXAMPLE_QUERIES = [
  "AI tools for HVAC contractors",
  "software for wedding photographers",
  "compliance tooling for indie fintechs",
  "meal planning for shift workers",
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false); // synchronous guard against double submits

  const runSearch = async (q) => {
    const trimmed = q.trim();
    if (trimmed.length < 3) {
      toast.error("Describe an industry, niche, or customer type (at least 3 characters).");
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setQuery(trimmed);
    setLoading(true);
    try {
      const { data } = await generateReport(trimmed);
      navigate(`/report/${data.report_id}`, { state: { report: data } });
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 429 || status === 503) {
        toast.error(detail || "Rate limit reached — try again later.");
      } else if (status === 422) {
        toast.error(detail || "Couldn't generate a report for this query — try rephrasing it.");
      } else {
        toast.error("Report generation failed — check your connection and try again.");
      }
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-16 sm:py-24">
            <div className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
              AI OPPORTUNITY REPORTS · EVIDENCE-REASONED · FREE WHILE IN BETA
            </div>
            <h1
              data-testid="search-headline"
              className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-black leading-[1.1]"
            >
              Find the next software business worth building.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[hsl(var(--mn-fg-subtle))] max-w-2xl leading-relaxed">
              Type an industry, niche, or customer type. Get a brutally honest opportunity
              report — customer pain, competition, a weighted Opportunity Score, and a
              recommended MVP — in about a minute.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Input
                data-testid="opportunity-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. scheduling software for mobile dog groomers"
                maxLength={200}
                disabled={loading}
                className="h-12 rounded-[12px] border-[hsl(var(--mn-border-strong))] text-sm sm:text-base"
              />
              <Button
                data-testid="opportunity-search-button"
                type="submit"
                disabled={loading}
                className="h-12 rounded-[12px] bg-black text-white hover:bg-black/90 active:bg-black/95 transition-colors duration-150 px-6 whitespace-nowrap"
              >
                Generate report <ArrowRight size={15} className="ml-1.5" />
              </Button>
            </form>

            {loading ? (
              <div className="mt-8">
                <LoadingTicker query={query} />
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
                  TRY
                </span>
                {EXAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    data-testid="search-example-chip"
                    onClick={() => runSearch(q)}
                    className="font-mono text-[11px] rounded-[10px] border border-[hsl(var(--mn-border))] px-2.5 py-1 text-[hsl(var(--mn-fg-subtle))] hover:border-[hsl(var(--mn-border-strong))] hover:text-black transition-colors duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="mn-divider" />

          <section className="py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  kicker: "01 · EVIDENCE OVER OPINIONS",
                  text: "Every report separates first-principles reasoning from known industry patterns, and says how confident it is.",
                },
                {
                  kicker: "02 · A SCORE YOU CAN AUDIT",
                  text: "Seven weighted dimensions — pain, demand, competition, revenue, trend, buildability, confidence — combined deterministically.",
                },
                {
                  kicker: "03 · ACTION OVER ANALYSIS",
                  text: "Each report ends with a recommended MVP, pricing, and a go-to-market plan — what to do next, not just what to think.",
                },
              ].map(({ kicker, text }) => (
                <div key={kicker} className="rounded-[14px] border border-[hsl(var(--mn-border))] p-5">
                  <div className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
                    {kicker}
                  </div>
                  <p className="mt-2 text-xs sm:text-[13px] text-black leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
