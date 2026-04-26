"use client";

import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Sparkles } from "lucide-react";

export function UpgradeButton({ label }: { label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative w-full overflow-hidden rounded-lg px-3 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 60%, #1d4ed8 100%)",
          backgroundSize: "200% 200%",
          animation: "proGradient 4s ease infinite",
          color: "#fff",
          boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 4px 14px rgba(99,102,241,0.25)",
        }}
      >
        {/* Shimmer sweep */}
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          }}
        />
        <span className="relative flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 opacity-90" />
          {label}
        </span>
      </button>
      <UpgradeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
