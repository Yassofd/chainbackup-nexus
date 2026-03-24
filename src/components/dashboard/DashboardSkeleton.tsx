import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <div className="glass-surface shadow-glass-md rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-14 h-4 rounded" />
      </div>
      <Skeleton className="w-24 h-7 rounded" />
      <Skeleton className="w-16 h-3 rounded" />
      <Skeleton className="w-full h-8 rounded" />
    </div>
  );
}

export function ClusterSkeleton() {
  return (
    <div className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-24 h-4 rounded" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <Skeleton className="w-20 h-3 rounded" />
            <Skeleton className="w-12 h-5 rounded" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-28 h-4 rounded" />
      </div>
      <div className="divide-y divide-border">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-5 py-3 flex items-center gap-4">
            <Skeleton className="w-4 h-4 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="w-32 h-3 rounded" />
              <Skeleton className="w-20 h-2.5 rounded" />
            </div>
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-24 h-4 rounded" />
      </div>
      <div className="p-5">
        <Skeleton className="w-full h-48 rounded-lg" />
      </div>
    </div>
  );
}

export function GaugeSkeleton() {
  return (
    <div className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-28 h-4 rounded" />
      </div>
      <div className="p-5 flex flex-col items-center space-y-4">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="w-full grid grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
