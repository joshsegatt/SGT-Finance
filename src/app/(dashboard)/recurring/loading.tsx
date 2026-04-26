import { Skeleton } from "@/components/ui/skeleton";

export default function RecurringLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_80px_90px_100px_120px_80px] gap-4 px-4 py-3 border-b border-border/50">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_80px_90px_100px_120px_80px] gap-4 px-4 py-3.5 border-b border-border/30 last:border-0 items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3.5 w-20 ml-auto" />
            <Skeleton className="h-7 w-16 rounded-md ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
