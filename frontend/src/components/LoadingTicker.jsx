import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const STATUS_LINES = [
  "Analyzing market signals…",
  "Mapping customer pain points…",
  "Sizing the competitive landscape…",
  "Scoring opportunity dimensions…",
  "Stress-testing revenue potential…",
  "Drafting the go-to-market plan…",
];

const SLOW_HINT_AFTER_SECS = 45;

export const LoadingTicker = ({ query }) => {
  const [lineIdx, setLineIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const lineTimer = setInterval(() => setLineIdx((i) => (i + 1) % STATUS_LINES.length), 4000);
    const clock = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      clearInterval(lineTimer);
      clearInterval(clock);
    };
  }, []);

  return (
    <div
      data-testid="report-loading-ticker"
      className="rounded-[14px] border border-[hsl(var(--mn-border-strong))] bg-[hsl(var(--mn-surface-2))] p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Loader2 className="animate-spin" size={14} />
        <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
          GENERATING REPORT · {String(Math.floor(elapsed / 60)).padStart(1, "0")}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="font-mono text-xs sm:text-sm text-black min-h-[1.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={lineIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {STATUS_LINES[lineIdx]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-2 text-xs text-[hsl(var(--mn-fg-subtle))]">
        Researching <span className="font-mono text-black">{query}</span>
        {elapsed >= SLOW_HINT_AFTER_SECS && (
          <span data-testid="report-loading-slow-hint">
            {" "}— still working, complex queries can take up to 90 seconds.
          </span>
        )}
      </div>
    </div>
  );
};
