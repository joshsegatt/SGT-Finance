import { ChartSkeleton, KpiSkeleton, TableRowSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-72 rounded-md bg-muted/60 animate-pulse" />
        </div>
        <div className="h-4 w-48 rounded-md bg-muted/40 animate-pulse" />
      </div>

      {/* KPI Cards — premium wave skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
            <KpiSkeleton />
          </div>
        ))}
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart Skeleton — real chart shape */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border/60 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-1.5">
              <div className="h-4 w-24 rounded-sm bg-muted animate-pulse" />
              <div className="h-3 w-20 rounded-sm bg-muted/60 animate-pulse" />
            </div>
          </div>
          <ChartSkeleton height={240} />
        </div>

        {/* Alerts skeleton */}
        <div className="bg-card rounded-xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-16 rounded-sm bg-muted animate-pulse" />
            <div className="h-5 w-14 rounded-full bg-muted/40 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-border/30"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted/60 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-3/4 rounded-sm bg-muted animate-pulse" />
                    <div className="h-3 w-full rounded-sm bg-muted/60 animate-pulse" />
                    {/* Inline action skeletons */}
                    <div className="flex gap-1.5 mt-2">
                      <div className="h-5 w-16 rounded-md bg-muted/40 animate-pulse" />
                      <div className="h-5 w-20 rounded-md bg-muted/40 animate-pulse" />
                      <div className="h-5 w-14 rounded-md bg-muted/40 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
          <div className="h-4 w-40 rounded-sm bg-muted animate-pulse" />
          <div className="h-3 w-14 rounded-sm bg-muted/60 animate-pulse" />
        </div>
        <TableRowSkeleton rows={6} />
      </div>
    </div>
  );
}
