"use client";

import { Lock, Sparkles } from "lucide-react";
import { UpgradeButton } from "./upgrade-button";
import { Plan } from "@prisma/client";

export function UpgradeRequired({ plan }: { plan: Plan }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-card/40 border border-dashed border-border rounded-2xl backdrop-blur-md animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/10 ring-1 ring-primary/20">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">Professional Feature</h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        This tool is available on our <span className="text-foreground font-semibold">Pro</span> and <span className="text-foreground font-semibold">Business</span> plans. 
        Upgrade today to unlock advanced financial insights and automated reports.
      </p>
      <div className="w-full max-w-[240px]">
        <UpgradeButton plan={plan} />
      </div>
      <div className="mt-8 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
        <Sparkles className="w-3 h-3" />
        Unlock Instant Analytics & Forecasts
      </div>
    </div>
  );
}
