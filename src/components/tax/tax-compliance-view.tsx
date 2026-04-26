"use client";

import { useState, useTransition } from "react";
import { updateDeadlineStatus } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import {
  ShieldCheck, AlertTriangle, Clock, CheckCircle2,
  Building2, ChevronDown, ChevronUp, Circle,
} from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  type: string;
  date: Date | string;
  status: string;
}

interface TaxProfile {
  vatNumber: string | null;
  corporateTaxRate: number | null;
  deadlines: Deadline[];
}

interface EntityData {
  id: string;
  name: string;
  country: string;
  currency: string;
  taxProfile: TaxProfile | null;
}

function complianceScore(entity: EntityData): number {
  if (!entity.taxProfile) return 0;
  const deadlines = entity.taxProfile.deadlines;
  if (deadlines.length === 0) return 100;
  const overdue = deadlines.filter((d) => d.status === "OVERDUE").length;
  const completed = deadlines.filter((d) => d.status === "COMPLETED").length;
  const score = Math.round(((completed + (deadlines.length - overdue - completed) * 0.5) / deadlines.length) * 100);
  return Math.max(0, Math.min(100, score));
}

function scoreColor(score: number) {
  if (score >= 80) return { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500", ring: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40" };
  if (score >= 50) return { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500", ring: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40" };
  return { text: "text-red-600 dark:text-red-400", bg: "bg-red-500", ring: "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40" };
}

const DEADLINE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.FC<{ className?: string }> }> = {
  UPCOMING: { label: "Upcoming", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40", icon: Clock },
  OVERDUE: { label: "Overdue", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40", icon: AlertTriangle },
  COMPLETED: { label: "Completed", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40", icon: CheckCircle2 },
};

function daysUntil(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `${diff}d left`;
}

function DeadlineRow({ deadline }: { deadline: Deadline }) {
  const [loading, startTransition] = useTransition();
  const cfg = DEADLINE_CONFIG[deadline.status] ?? DEADLINE_CONFIG.UPCOMING;
  const Icon = cfg.icon;

  function markComplete() {
    startTransition(() => updateDeadlineStatus(deadline.id, "COMPLETED"));
  }

  function markUpcoming() {
    startTransition(() => updateDeadlineStatus(deadline.id, "UPCOMING"));
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${cfg.bg} transition-all`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${deadline.status === "COMPLETED" ? "bg-emerald-100 dark:bg-emerald-900/40" : deadline.status === "OVERDUE" ? "bg-red-100 dark:bg-red-900/40" : "bg-blue-100 dark:bg-blue-900/40"}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${deadline.status === "COMPLETED" ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {deadline.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{deadline.type}</span>
          <span className="text-[10px] text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground">{formatDate(deadline.date)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-medium hidden sm:block ${cfg.color}`}>
          {deadline.status !== "COMPLETED" ? daysUntil(deadline.date) : "Done"}
        </span>
        {deadline.status !== "COMPLETED" ? (
          <button
            onClick={markComplete}
            disabled={loading}
            className="text-xs px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "…" : "Done"}
          </button>
        ) : (
          <button
            onClick={markUpcoming}
            disabled={loading}
            className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "…" : "Reopen"}
          </button>
        )}
      </div>
    </div>
  );
}

function EntityComplianceCard({ entity }: { entity: EntityData }) {
  const [expanded, setExpanded] = useState(false);
  const score = complianceScore(entity);
  const colors = scoreColor(score);
  const deadlines = entity.taxProfile?.deadlines ?? [];
  const overdue = deadlines.filter((d) => d.status === "OVERDUE").length;
  const upcoming = deadlines.filter((d) => d.status === "UPCOMING").length;
  const completed = deadlines.filter((d) => d.status === "COMPLETED").length;

  const sorted = [...deadlines].sort((a, b) => {
    const order = { OVERDUE: 0, UPCOMING: 1, COMPLETED: 2 };
    const ao = order[a.status as keyof typeof order] ?? 1;
    const bo = order[b.status as keyof typeof order] ?? 1;
    if (ao !== bo) return ao - bo;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{entity.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{entity.country} · {entity.currency}</p>
            </div>
          </div>
          {/* Compliance score ring */}
          <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 shrink-0 ${score >= 80 ? "border-emerald-400 dark:border-emerald-600" : score >= 50 ? "border-amber-400 dark:border-amber-600" : "border-red-400 dark:border-red-600"} bg-card`}>
            <span className={`text-lg font-bold leading-none ${colors.text}`}>{score}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wide">score</span>
          </div>
        </div>

        {/* Tax profile info */}
        {entity.taxProfile ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {entity.taxProfile.vatNumber && (
              <div className="bg-muted/30 rounded-lg px-3 py-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">VAT</div>
                <div className="text-xs font-mono font-semibold text-foreground mt-0.5">{entity.taxProfile.vatNumber}</div>
              </div>
            )}
            <div className="bg-muted/30 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Corp. Tax</div>
              <div className="text-xs font-semibold text-foreground mt-0.5">{entity.taxProfile.corporateTaxRate ?? "—"}%</div>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <Circle className="w-3.5 h-3.5 shrink-0" />
            No tax profile configured
          </div>
        )}

        {/* Deadline counts */}
        {deadlines.length > 0 && (
          <div className="mt-4 flex gap-2">
            {overdue > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40 font-medium">
                <AlertTriangle className="w-3 h-3" />{overdue} overdue
              </span>
            )}
            {upcoming > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 font-medium">
                <Clock className="w-3 h-3" />{upcoming} upcoming
              </span>
            )}
            {completed > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 font-medium">
                <CheckCircle2 className="w-3 h-3" />{completed} done
              </span>
            )}
          </div>
        )}

        {/* Progress bar */}
        {deadlines.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden flex gap-0.5">
              {completed > 0 && (
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(completed / deadlines.length) * 100}%` }} />
              )}
              {upcoming > 0 && (
                <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${(upcoming / deadlines.length) * 100}%` }} />
              )}
              {overdue > 0 && (
                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(overdue / deadlines.length) * 100}%` }} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deadlines list */}
      {deadlines.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <span className="font-medium">{deadlines.length} Deadline{deadlines.length !== 1 ? "s" : ""}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {expanded && (
            <div className="px-4 pb-4 space-y-2">
              {sorted.map((d) => (
                <DeadlineRow key={d.id} deadline={d} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TaxComplianceView({
  entities,
  allEntities,
  selectedEntityId,
}: {
  entities: EntityData[];
  allEntities: { id: string; name: string }[];
  selectedEntityId?: string;
}) {
  const allDeadlines = entities.flatMap((e) => e.taxProfile?.deadlines ?? []);
  const overdueCount = allDeadlines.filter((d) => d.status === "OVERDUE").length;
  const upcomingCount = allDeadlines.filter((d) => d.status === "UPCOMING").length;
  const completedCount = allDeadlines.filter((d) => d.status === "COMPLETED").length;
  const avgScore = entities.length > 0
    ? Math.round(entities.reduce((s, e) => s + complianceScore(e), 0) / entities.length)
    : 0;
  const avgColors = scoreColor(avgScore);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 card-shadow flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${avgColors.ring} border`}>
            <ShieldCheck className={`w-[18px] h-[18px] ${avgColors.text}`} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg. Score</div>
            <div className={`text-xl font-bold ${avgColors.text}`}>{avgScore}<span className="text-sm font-normal text-muted-foreground">/100</span></div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 card-shadow flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-[18px] h-[18px] text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Overdue</div>
            <div className={`text-xl font-bold ${overdueCount > 0 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{overdueCount}</div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 card-shadow flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
            <Clock className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Upcoming</div>
            <div className="text-xl font-bold text-foreground">{upcomingCount}</div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 card-shadow flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Entity filter */}
      <div className="flex gap-2 flex-wrap">
        <a
          href="/tax"
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!selectedEntityId ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground/50 bg-card"}`}
        >
          All Entities
        </a>
        {allEntities.map((e) => (
          <a
            key={e.id}
            href={`/tax?entityId=${e.id}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedEntityId === e.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground/50 bg-card"}`}
          >
            {e.name}
          </a>
        ))}
      </div>

      {/* Entity cards */}
      {entities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl">
          <ShieldCheck className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No entities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {entities.map((entity) => (
            <EntityComplianceCard key={entity.id} entity={entity} />
          ))}
        </div>
      )}

      {/* Global deadline timeline */}
      {allDeadlines.length > 0 && (
        <div className="bg-card rounded-xl border border-border panel-shadow">
          <div className="px-6 py-4 border-b border-border/40">
            <h2 className="font-semibold text-foreground text-sm">
              All Deadlines
              {overdueCount > 0 && (
                <span className="ml-2 text-xs font-normal text-red-500">· {overdueCount} overdue</span>
              )}
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {[...allDeadlines]
              .sort((a, b) => {
                const order = { OVERDUE: 0, UPCOMING: 1, COMPLETED: 2 };
                const ao = order[a.status as keyof typeof order] ?? 1;
                const bo = order[b.status as keyof typeof order] ?? 1;
                if (ao !== bo) return ao - bo;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              })
              .map((d) => (
                <DeadlineRow key={d.id} deadline={d} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
