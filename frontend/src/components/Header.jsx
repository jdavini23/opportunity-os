import React from "react";
import { Link } from "react-router-dom";
import { Radar } from "lucide-react";

export const Header = () => (
  <header className="sticky top-0 z-40 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-[hsl(var(--mn-border))]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <Link to="/" data-testid="header-logo-link" className="flex items-center gap-2 text-black">
        <Radar size={18} strokeWidth={2.2} />
        <span className="font-semibold tracking-tight text-sm sm:text-base">OpportunityOS</span>
        <span className="hidden sm:inline font-mono text-[10px] text-[hsl(var(--mn-fg-subtle))] ml-2">BETA</span>
      </Link>
      <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--mn-fg-subtle))]">
        MARKET INTELLIGENCE FOR FOUNDERS
      </span>
    </div>
  </header>
);
