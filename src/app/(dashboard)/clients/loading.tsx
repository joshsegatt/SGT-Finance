import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* List + Detail panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: list */}
        <div className="xl:col-span-1 space-y-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-3 space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-28" />
                <div className="flex gap-3 pt-0.5">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: detail panel placeholder */}
        <div className="xl:col-span-2">
          <div className="bg-card rounded-xl border border-border border-dashed h-48 flex items-center justify-center">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
