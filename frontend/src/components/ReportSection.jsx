import React from "react";

export const ReportSection = ({ kicker, title, testId, children }) => (
  <section data-testid={testId} className="py-6 border-t border-[hsl(var(--mn-border))] first:border-t-0">
    <div className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
      {kicker}
    </div>
    {title && (
      <h2 className="mt-1 mb-3 text-lg sm:text-xl font-semibold tracking-tight text-black">{title}</h2>
    )}
    <div className={title ? "" : "mt-3"}>{children}</div>
  </section>
);
