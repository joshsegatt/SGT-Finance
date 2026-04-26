import { Skeleton } from "@/components/ui/skeleton";

export default function AccountsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="text-right space-y-1.5">
          <Skeleton className="h-3 w-28 ml-auto" />
          <Skeleton className="h-7 w-32 ml-auto" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_100px_100px_160px_100px_120px_80px] gap-4 px-4 py-3 border-b border-border/50">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_100px_100px_160px_100px_120px_80px] gap-4 px-4 py-4 border-b border-border/30 last:border-0 items-center">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3.5 w-20 ml-auto" />
            <Skeleton className="h-7 w-14 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
