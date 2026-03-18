import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warning" | "info";

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  source: string;
  time: Date;
  acknowledged: boolean;
}

const initialAlerts: Alert[] = [
  { id: "ALT-1", severity: "critical", title: "CPU threshold exceeded", description: "Node us-east-1-a CPU at 94% for 5+ minutes. Auto-scaling triggered.", source: "us-east-1-a", time: new Date(2026, 2, 18, 9, 42), acknowledged: false },
  { id: "ALT-2", severity: "critical", title: "Disk space critically low", description: "Node ap-south-1 disk usage at 97%. Immediate action required.", source: "ap-south-1", time: new Date(2026, 2, 18, 9, 38), acknowledged: false },
  { id: "ALT-3", severity: "warning", title: "Memory usage elevated", description: "Node eu-west-2-b RAM at 82%. Approaching configured threshold of 85%.", source: "eu-west-2-b", time: new Date(2026, 2, 18, 9, 30), acknowledged: false },
  { id: "ALT-4", severity: "warning", title: "Backup job delayed", description: "Scheduled backup BKP-2850 is 12 minutes past expected start time.", source: "scheduler", time: new Date(2026, 2, 18, 9, 22), acknowledged: true },
  { id: "ALT-5", severity: "info", title: "Node joined cluster", description: "Node us-west-2-d successfully joined the cluster and is syncing.", source: "us-west-2-d", time: new Date(2026, 2, 18, 9, 15), acknowledged: true },
  { id: "ALT-6", severity: "warning", title: "High network latency", description: "Latency to ap-east-1 spiked to 45ms (p99). Investigating route.", source: "ap-east-1", time: new Date(2026, 2, 18, 9, 8), acknowledged: false },
  { id: "ALT-7", severity: "info", title: "Auto-scaling completed", description: "Horizontal scaling added 2 replicas to us-east-1 region.", source: "autoscaler", time: new Date(2026, 2, 18, 8, 55), acknowledged: true },
  { id: "ALT-8", severity: "critical", title: "Replication lag detected", description: "Replica eu-central-1 is 340s behind master. May impact read consistency.", source: "eu-central-1", time: new Date(2026, 2, 18, 8, 44), acknowledged: false },
];

const severityConfig: Record<Severity, { icon: typeof AlertTriangle; color: string; bg: string; ring: string }> = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", ring: "ring-destructive/20" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", ring: "ring-warning/20" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/20" },
};

const severityFilters: ("all" | Severity)[] = ["all", "critical", "warning", "info"];

export function AlertsFeed() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<"all" | Severity>("all");

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="glass-surface shadow-glass-md rounded-xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Active Alerts</h3>
          {unacknowledged > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-destructive/10 text-destructive ring-1 ring-destructive/20 tabular-nums">
              {unacknowledged}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {severityFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md font-medium transition-colors",
                filter === s ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.map((alert) => {
            const cfg = severityConfig[alert.severity];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn("px-5 py-3.5 flex items-start gap-3 transition-colors", !alert.acknowledged && "bg-card/40")}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                  <cfg.icon className={cn("w-4 h-4", cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded ring-1", cfg.bg, cfg.color, cfg.ring)}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">{alert.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <span>{alert.source}</span>
                    <span>·</span>
                    <span>{format(alert.time, "HH:mm")}</span>
                    {alert.acknowledged && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-success"><CheckCircle className="w-3 h-3" /> Acknowledged</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledge(alert.id)}
                      className="h-7 px-2.5 text-[11px] font-medium rounded-md bg-primary/10 text-primary ring-1 ring-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <CheckCircle className="w-8 h-8 text-success/40 mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">No alerts match this filter</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
        <span>{filtered.length} alerts · {unacknowledged} unacknowledged</span>
        <button className="text-primary hover:underline">View alert history →</button>
      </div>
    </div>
  );
}
