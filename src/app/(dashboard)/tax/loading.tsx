import { Skeleton } from "@/components/ui/skeleton";

export default function TaxLoading() {
  return (
    <div className="space-y-8">
      {/* Header + filters */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Entity summary cards */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4">
          {/* Card header */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* KPI mini row */}
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              ))}
            </div>

            {/* Deadlines table */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <Skeleton className="h-3 w-20 mb-3" />
              {Array.from({ length: 3 }).map((_, k) => (
                <div key={k} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
