"use client";

import { markAlertRead } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  AlertCircle, Info, X, Check, Clock, Eye, ChevronDown,
  CreditCard, FileText, Bell, BellOff,
} from "lucide-react";
import { useState, useTransition } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
}

type AlertAction = "dismiss" | "resolve" | "snooze" | "view";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse alert description to extract actionable entities */
function parseAlertMeta(alert: Alert): {
  invoiceNumber?: string;
  entityName?: string;
  amount?: string;
  daysOverdue?: number;
  actionType: "invoice" | "tax" | "subscription" | "general";
} {
  const desc = alert.description.toLowerCase();

  if (desc.includes("invoice") || desc.includes("inv-")) {
    const match = alert.description.match(/INV-[\d-]+/);
    const daysMatch = alert.description.match(/(\d+)\s*days?/);
    return {
      invoiceNumber: match?.[0],
      daysOverdue: daysMatch ? parseInt(daysMatch[1]) : undefined,
      actionType: "invoice",
    };
  }

  if (desc.includes("tax") || desc.includes("vat") || desc.includes("deadline")) {
    const daysMatch = alert.description.match(/(\d+)\s*days?/);
    return {
      daysOverdue: daysMatch ? parseInt(daysMatch[1]) : undefined,
      actionType: "tax",
    };
  }

  if (desc.includes("subscription") || desc.includes("unused") || desc.includes("zoom")) {
    return { actionType: "subscription" };
  }

  return { actionType: "general" };
}

// ─── Icon Map ────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  WARNING: {
    icon: AlertCircle,
    iconColor: "text-amber-500",
    bg: "bg-amber-500/8",
    borderHover: "hover:border-amber-500/30",
    pill: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    pillLabel: "Warning",
  },
  INFO: {
    icon: Info,
    iconColor: "text-primary/70",
    bg: "bg-primary/8",
    borderHover: "hover:border-primary/30",
    pill: "bg-primary/10 text-primary",
    pillLabel: "Info",
  },
  SUCCESS: {
    icon: Check,
    iconColor: "text-emerald-500",
    bg: "bg-emerald-500/8",
    borderHover: "hover:border-emerald-500/30",
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pillLabel: "Resolved",
  },
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function AlertCard({ alert }: { alert: Alert }) {
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [snoozed, setSnoozed] = useState(false);

  const meta = parseAlertMeta(alert);
  const config = TYPE_CONFIG[alert.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.INFO;
  const Icon = config.icon;

  if (resolved) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 transition-all duration-300">
        <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-500" />
        </div>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          {alert.title} — Resolved
        </p>
      </div>
    );
  }

  if (snoozed) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 transition-all duration-300 opacity-60">
        <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground font-medium">
          {alert.title} — Snoozed for 24h
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-border/50 ${config.borderHover} transition-all duration-200 group overflow-hidden ${
        expanded ? "ring-1 ring-primary/10" : ""
      }`}
    >
      {/* Main Row */}
      <div className="flex items-start gap-3 p-3">
        <div className={`mt-0.5 w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground truncate">{alert.title}</p>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${config.pill} shrink-0`}>
              {config.pillLabel}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.description}</p>

          {/* Inline Quick Actions — always visible */}
          <div className="flex items-center gap-1.5 mt-2.5">
            {meta.actionType === "invoice" && (
              <>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await markAlertRead(alert.id);
                      setResolved(true);
                    })
                  }
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md
                    bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                    hover:bg-emerald-500/20 active:scale-[0.97] transition-all duration-150"
                >
                  <CreditCard className="w-3 h-3" />
                  Mark Paid
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await markAlertRead(alert.id);
                      setResolved(true);
                    })
                  }
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md
                    bg-primary/10 text-primary
                    hover:bg-primary/20 active:scale-[0.97] transition-all duration-150"
                >
                  <FileText className="w-3 h-3" />
                  View Invoice
                </button>
              </>
            )}
            {meta.actionType === "tax" && (
              <button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await markAlertRead(alert.id);
                    setResolved(true);
                  })
                }
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md
                  bg-primary/10 text-primary
                  hover:bg-primary/20 active:scale-[0.97] transition-all duration-150"
              >
                <Check className="w-3 h-3" />
                Mark Completed
              </button>
            )}
            {meta.actionType === "subscription" && (
              <button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await markAlertRead(alert.id);
                    setResolved(true);
                  })
                }
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md
                  bg-red-500/10 text-red-500
                  hover:bg-red-500/20 active:scale-[0.97] transition-all duration-150"
              >
                <X className="w-3 h-3" />
                Cancel Sub
              </button>
            )}

            {/* Universal snooze */}
            <button
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  await markAlertRead(alert.id);
                  setSnoozed(true);
                });
              }}
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md
                text-muted-foreground hover:bg-muted/60 active:scale-[0.97] transition-all duration-150"
            >
              <Clock className="w-3 h-3" />
              Snooze
            </button>
          </div>
        </div>

        {/* Dismiss */}
        {!alert.isRead && (
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={pending}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
            onClick={() =>
              startTransition(async () => {
                await markAlertRead(alert.id);
              })
            }
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
