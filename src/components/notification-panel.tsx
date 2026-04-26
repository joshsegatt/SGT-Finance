"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Bell,
  AlertTriangle,
  Clock,
  TrendingDown,
  CheckCheck,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { markAlertRead, markAllAlertsRead } from "@/lib/actions";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationPanelProps {
  alerts: Alert[];
}

function getAlertIcon(type: string) {
  switch (type) {
    case "OVERDUE":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "DEADLINE":
      return <Clock className="w-4 h-4 text-amber-500" />;
    case "WASTE":
      return <TrendingDown className="w-4 h-4 text-violet-500" />;
    case "WARNING":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    default:
      return (
        <div className="w-4 h-4 rounded-full border-2 border-primary/60 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </div>
      );
  }
}

function getAlertAccent(type: string) {
  switch (type) {
    case "OVERDUE":
      return "border-l-red-500/70 bg-red-500/5 hover:bg-red-500/[0.08]";
    case "DEADLINE":
      return "border-l-amber-500/70 bg-amber-500/5 hover:bg-amber-500/[0.08]";
    case "WASTE":
      return "border-l-violet-500/70 bg-violet-500/5 hover:bg-violet-500/[0.08]";
    default:
      return "border-l-primary/40 bg-primary/5 hover:bg-primary/[0.08]";
  }
}

function getAlertLink(id: string) {
  if (id.startsWith("smart-inv-")) return "/invoices";
  if (id.startsWith("smart-dl-")) return "/tax";
  if (id.startsWith("smart-sub-")) return "/recurring";
  return null;
}

function relativeTime(date: Date, t: (key: string, values?: Record<string, number>) => string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return t("justNow");
  if (mins < 60) return t("minsAgo", { m: mins });
  if (hours < 24) return t("hoursAgo", { h: hours });
  if (days < 7) return t("daysAgo", { d: days });
  return new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function NotificationPanel({ alerts }: NotificationPanelProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("Notifications");
  const unread = alerts.filter((a) => !a.isRead);

  function dismiss(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    startTransition(async () => {
      await markAlertRead(id);
    });
  }

  function dismissAll() {
    startTransition(async () => {
      await markAllAlertsRead();
    });
  }

  function navigate(id: string) {
    const link = getAlertLink(id);
    if (link) {
      startTransition(async () => {
        await markAlertRead(id);
        router.push(link);
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 relative transition-colors outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{t("title")}</span>
            {unread.length > 0 && (
              <span className="text-[11px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-bold tabular-nums">
                {unread.length} {t("new")}
              </span>
            )}
          </div>
          {unread.length > 1 && (
            <button
              onClick={dismissAll}
              disabled={pending}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              title={t("markAllRead")}
            >
              <CheckCheck className="w-3 h-3" />
              {t("markAllRead")}
            </button>
          )}
        </div>

        {/* Alert list */}
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border/20">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center">
                <CheckCheck className="w-5 h-5 opacity-50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{t("allCaughtUp")}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{t("noAlertsNow")}</p>
              </div>
            </div>
          ) : (
            alerts.map((alert) => {
              const link = getAlertLink(alert.id);
              const isClickable = !!link;
              return (
                <div
                  key={alert.id}
                  onClick={() => navigate(alert.id)}
                  className={`relative flex items-start gap-3 px-4 py-3.5 group transition-colors border-l-2 ${
                    !alert.isRead
                      ? getAlertAccent(alert.type)
                      : "border-l-transparent hover:bg-muted/20"
                  } ${isClickable ? "cursor-pointer" : ""}`}
                >
                  {/* Icon */}
                  <div className="mt-0.5 shrink-0">{getAlertIcon(alert.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-5">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p
                        className={`text-xs font-semibold leading-tight ${
                          !alert.isRead ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {alert.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground/50 shrink-0 tabular-nums mt-px">
                        {relativeTime(alert.createdAt, t as (key: string, values?: Record<string, number>) => string)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {alert.description}
                    </p>
                    {isClickable && !alert.isRead && (
                      <p className="text-[10px] text-primary/60 mt-1 font-medium">
                        {t("clickToView")}
                      </p>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!alert.isRead && (
                    <div className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:opacity-0 transition-opacity" />
                  )}

                  {/* Dismiss button */}
                  {!alert.isRead && (
                    <button
                      disabled={pending}
                      onClick={(e) => dismiss(e, alert.id)}
                      className="absolute top-3 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                      aria-label="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {alerts.length > 0 && (
          <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20">
            <p className="text-[11px] text-muted-foreground text-center">
              {unread.length === 0
                ? "All notifications read"
                : `${unread.length} unread — hover to dismiss`}
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
