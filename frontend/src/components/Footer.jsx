import React from "react";

export const Footer = () => (
  <footer className="border-t border-[hsl(var(--mn-border))] mt-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
        OPPORTUNITYOS
      </span>
      <span className="text-xs text-[hsl(var(--mn-fg-subtle))]">
        Evidence over opinions. Action over analysis.
      </span>
    </div>
  </footer>
);
