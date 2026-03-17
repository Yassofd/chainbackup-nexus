import { cn } from "@/lib/utils";

type Status = "active" | "syncing" | "failed" | "completed" | "pending";

const statusConfig: Record<Status, { classes: string; label: string }> = {
  active: {
    classes: "bg-success/10 text-success ring-1 ring-success/20",
    label: "Active",
  },
  syncing: {
    classes: "bg-primary/10 text-primary ring-1 ring-primary/20 status-pulse",
    label: "Syncing",
  },
  failed: {
    classes: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
    label: "Failed",
  },
  completed: {
    classes: "bg-success/10 text-success ring-1 ring-success/20",
    label: "Completed",
  },
  pending: {
    classes: "bg-warning/10 text-warning ring-1 ring-warning/20",
    label: "Pending",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        config.classes
      )}
    >
      {config.label}
    </span>
  );
}
