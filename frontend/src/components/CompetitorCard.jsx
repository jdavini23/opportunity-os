import React from "react";

export const CompetitorCard = ({ competitor }) => (
  <div
    data-testid="report-competitor-card"
    className="rounded-[12px] border border-[hsl(var(--mn-border))] p-4"
  >
    <div className="font-semibold text-sm text-black">{competitor.name}</div>
    <p className="mt-1 text-xs sm:text-[13px] text-[hsl(var(--mn-fg-subtle))] leading-relaxed">
      {competitor.description}
    </p>
    <div className="mt-3 pt-3 border-t border-[hsl(var(--mn-border))]">
      <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
        EXPLOITABLE GAP
      </span>
      <p className="mt-1 text-xs sm:text-[13px] text-black leading-relaxed">{competitor.weakness}</p>
    </div>
  </div>
);
