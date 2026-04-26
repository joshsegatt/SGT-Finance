import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
        <Skeleton className="h-8 w-40 ml-4" />
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border/60 p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-32" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-6">
          <Skeleton className="h-4 w-32 mb-5" />
          <Skeleton className="h-[280px] w-full" />
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-6">
          <Skeleton className="h-4 w-32 mb-5" />
          <Skeleton className="h-[280px] w-full" />
        </div>
      </div>
    </div>
  );
}
