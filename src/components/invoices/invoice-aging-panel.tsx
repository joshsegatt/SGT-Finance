import { formatCurrency } from "@/lib/format";

interface AgingBucket {
  count: number;
  total: number;
}

interface InvoiceAgingPanelProps {
  aging: {
    current: AgingBucket;
    days30: AgingBucket;
    days60: AgingBucket;
    days90plus: AgingBucket;
  };
}

const BUCKETS = [
  { key: "current" as const, label: "Current", sublabel: "Not yet due", color: "#22c55e", bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { key: "days30" as const, label: "1–30 days", sublabel: "Mildly overdue", color: "#f59e0b", bg: "bg-amber-500/10", text: "text-amber-500" },
  { key: "days60" as const, label: "31–60 days", sublabel: "Attention needed", color: "#f97316", bg: "bg-orange-500/10", text: "text-orange-500" },
  { key: "days90plus" as const, label: "60+ days", sublabel: "Critical", color: "#ef4444", bg: "bg-red-500/10", text: "text-red-500" },
];

export function InvoiceAgingPanel({ aging }: InvoiceAgingPanelProps) {
  const grandTotal = BUCKETS.reduce((s, b) => s + aging[b.key].total, 0);

  if (grandTotal === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Invoice Aging</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Receivables breakdown by age</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total Outstanding</div>
          <div className="text-base font-bold text-foreground">{formatCurrency(grandTotal)}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-border/40">
        {BUCKETS.map((bucket) => {
          const data = aging[bucket.key];
          const pct = grandTotal > 0 ? (data.total / grandTotal) * 100 : 0;

          return (
            <div key={bucket.key} className="p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: bucket.color }} />
                <span className="text-xs font-semibold text-muted-foreground">{bucket.label}</span>
              </div>
              <div className={`text-lg font-bold ${data.count > 0 ? bucket.text : "text-muted-foreground/40"}`}>
                {formatCurrency(data.total)}
              </div>
              <div className="text-xs text-muted-foreground">
                {data.count} invoice{data.count !== 1 ? "s" : ""}
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: bucket.color }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground/60">{pct.toFixed(0)}% of total</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
