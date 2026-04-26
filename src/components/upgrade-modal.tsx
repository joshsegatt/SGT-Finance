"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles, Link2, FileDown, Users, BarChart3, FileText,
  ArrowRight, Bot, Bell, ShieldCheck, Webhook, Check, X,
} from "lucide-react";

const PRO_FEATURES = [
  {
    icon: Link2,
    title: "Live Bank Sync",
    description: "GoCardless auto-sync — transactions update every hour, no CSV uploads.",
    tag: "Most popular",
  },
  {
    icon: Bot,
    title: "AI Auto-Categorization",
    description: "Machine learning rules learn your spending patterns and categorise automatically.",
    tag: null,
  },
  {
    icon: Users,
    title: "Multi-User RBAC",
    description: "Invite advisors, finance managers and viewers with granular role controls.",
    tag: null,
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Forecasting, entity benchmarking, YoY comparisons and drill-down reports.",
    tag: null,
  },
  {
    icon: FileText,
    title: "Tax Filing Pre-fill",
    description: "Auto-populate VAT returns and corporation tax from your live transaction data.",
    tag: "Unique",
  },
  {
    icon: Bell,
    title: "Weekly Digest",
    description: "Automated email summary of your financial health every Monday morning.",
    tag: null,
  },
  {
    icon: FileDown,
    title: "Branded PDF Invoices",
    description: "Your logo, custom colours — professional PDFs sent directly from the dashboard.",
    tag: null,
  },
  {
    icon: ShieldCheck,
    title: "Audit Log",
    description: "Full history of every change across accounts, invoices and settings.",
    tag: null,
  },
  {
    icon: Webhook,
    title: "API & Webhooks",
    description: "REST API + webhook triggers to integrate with your existing stack.",
    tag: "Power users",
  },
] as const;

const FREE_VS_PRO = [
  { feature: "Manual CSV upload", free: true, pro: true },
  { feature: "Live bank sync", free: false, pro: true },
  { feature: "Invoices & clients", free: true, pro: true },
  { feature: "AI categorization", free: false, pro: true },
  { feature: "Analytics & reports", free: "Basic", pro: "Advanced" },
  { feature: "Multi-user access", free: false, pro: true },
  { feature: "Audit log", free: false, pro: true },
  { feature: "API access", free: false, pro: true },
];

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

function FeatureRow({ free, pro }: { free: boolean | string; pro: boolean | string }) {
  const render = (val: boolean | string) => {
    if (val === true) return <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" />;
    if (val === false) return <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" />;
    return <span className="text-[11px] text-muted-foreground font-medium">{val}</span>;
  };
  return (
    <div className="flex items-center">
      <div className="w-6 text-center">{render(free)}</div>
      <div className="w-6 text-center">{render(pro)}</div>
    </div>
  );
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg p-0 border-0 shadow-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "min(90dvh, 700px)",
          animation: open ? "modalSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) both" : undefined,
        }}
      >
        {/* ── Hero header ─────────────────────────────────── */}
        <div
          className="relative px-6 pt-6 pb-5 overflow-hidden shrink-0"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          }}
        >
          {/* Animated glow blob */}
          <div
            className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
              animation: "proGradient 6s ease infinite",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
            }}
          />

          {/* Badge + title */}
          <div className="relative flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 8px 24px rgba(99,102,241,0.35)",
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogHeader className="p-0 text-left">
                  <DialogTitle className="text-xl font-black text-white tracking-tight">
                    SGT Pro
                  </DialogTitle>
                </DialogHeader>
                <span
                  className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff" }}
                >
                  PRO
                </span>
              </div>
              <DialogDescription className="text-xs text-white/50 mt-0.5">
                Institutional-grade tools for serious finance teams
              </DialogDescription>
            </div>
          </div>

          {/* Free vs Pro quick table */}
          <div className="relative rounded-xl border border-white/10 overflow-hidden">
            <div className="grid" style={{ gridTemplateColumns: "1fr 48px 64px" }}>
              {/* Header */}
              <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Feature</div>
              <div className="py-1.5 text-center text-[10px] font-bold text-white/40 uppercase tracking-widest">Free</div>
              <div className="py-1.5 text-center text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#a78bfa" }}>Pro</div>

              {FREE_VS_PRO.map((row, i) => (
                <>
                  <div
                    key={`label-${i}`}
                    className="px-3 py-1.5 text-xs text-white/70 border-t border-white/5"
                  >
                    {row.feature}
                  </div>
                  <div key={`free-${i}`} className="py-1.5 flex items-center justify-center border-t border-white/5">
                    {row.free === true ? <Check className="w-3.5 h-3.5 text-white/40" /> :
                     row.free === false ? <X className="w-3.5 h-3.5 text-white/20" /> :
                     <span className="text-[10px] text-white/40">{row.free}</span>}
                  </div>
                  <div
                    key={`pro-${i}`}
                    className="py-1.5 flex items-center justify-center border-t border-white/5"
                    style={{ background: "rgba(99,102,241,0.06)" }}
                  >
                    {row.pro === true ? <Check className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} /> :
                     row.pro === false ? <X className="w-3.5 h-3.5 text-white/20" /> :
                     <span className="text-[10px] font-semibold" style={{ color: "#a78bfa" }}>{row.pro}</span>}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features list ────────────────────────────────── */}
        <div className="px-6 py-4 flex-1 min-h-0 overflow-y-auto space-y-2 bg-card">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Everything in Pro
          </p>
          {PRO_FEATURES.map(({ icon: Icon, title, description, tag }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-150 group"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">{title}</p>
                  {tag && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary uppercase tracking-wider shrink-0">
                      {tag}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA footer ───────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border/40 bg-card space-y-3 shrink-0">
          <button
            onClick={() => { window.location.href = "mailto:hello@sgt.com?subject=SGT Pro Upgrade"; }}
            className="group relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #4f46e5 100%)",
              backgroundSize: "200% 200%",
              animation: "proGradient 4s ease infinite",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}
            />
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Get SGT Pro
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            No automatic billing · bespoke onboarding · cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
