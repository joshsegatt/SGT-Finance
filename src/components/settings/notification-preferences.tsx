"use client";

import { useState } from "react";
import { Bell, Mail, AlertTriangle, TrendingDown, FileText, Check } from "lucide-react";

interface Pref {
  key: string;
  label: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
  defaultOn: boolean;
}

const PREFS: Pref[] = [
  { key: "overdueInvoices", label: "Overdue Invoices", desc: "Alert when invoices pass their due date", icon: FileText, defaultOn: true },
  { key: "taxDeadlines", label: "Tax Deadlines", desc: "Remind 7 days before a tax deadline", icon: AlertTriangle, defaultOn: true },
  { key: "lowBalance", label: "Low Balance Warning", desc: "Alert when account balance drops below threshold", icon: TrendingDown, defaultOn: true },
  { key: "weeklyDigest", label: "Weekly Digest Email", desc: "Summary of financial activity every Monday", icon: Mail, defaultOn: false },
  { key: "inAppAlerts", label: "In-App Alerts", desc: "Show notification bell for unread alerts", icon: Bell, defaultOn: true },
];

function loadPrefs() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("sgt_notif_prefs");
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch { return {}; }
}

function savePrefs(prefs: Record<string, boolean>) {
  try { localStorage.setItem("sgt_notif_prefs", JSON.stringify(prefs)); } catch { /* noop */ }
}

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
    const saved = loadPrefs();
    const defaults: Record<string, boolean> = {};
    for (const p of PREFS) defaults[p.key] = saved[p.key] ?? p.defaultOn;
    return defaults;
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    savePrefs(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      {PREFS.map((pref) => {
        const Icon = pref.icon;
        const on = prefs[pref.key] ?? pref.defaultOn;
        return (
          <div
            key={pref.key}
            className="flex items-center justify-between gap-4 py-3 border-b border-border/30 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${on ? "bg-primary/10" : "bg-muted/50"}`}>
                <Icon className={`w-4 h-4 transition-colors ${on ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(pref.key)}
              role="switch"
              aria-checked={on}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer ${on ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-4" : "translate-x-0"}`}
              />
            </button>
          </div>
        );
      })}
      {saved && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in">
          <Check className="w-3.5 h-3.5" /> Preferences saved
        </div>
      )}
    </div>
  );
}
