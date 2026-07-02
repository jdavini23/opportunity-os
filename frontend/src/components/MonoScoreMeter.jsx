import React from "react";

// Monochrome fill bar for a single score dimension. No color anywhere —
// meaning is carried by the numeric value and the fill width.
export const MonoScoreMeter = ({ label, value, testId }) => (
  <div data-testid={testId} className="rounded-[12px] border border-[hsl(var(--mn-border))] p-3">
    <div className="flex items-center justify-between gap-2 mb-2">
      <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))] uppercase">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold text-black">
        {value}
        <span className="text-[hsl(var(--mn-fg-subtle))] text-xs">/100</span>
      </span>
    </div>
    <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-black transition-[width] duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  </div>
);
