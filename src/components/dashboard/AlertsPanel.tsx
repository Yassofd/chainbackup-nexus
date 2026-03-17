import { motion } from "framer-motion";
import { AlertTriangle, AlertOctagon, Bell } from "lucide-react";

const alerts = [
  { level: "critical" as const, message: "Node ap-south-1-stg is unreachable", time: "3 min ago", action: "Investigate" },
  { level: "critical" as const, message: "Backup BKP-2845 failed: timeout after 120s", time: "14 min ago", action: "Retry" },
  { level: "warning" as const, message: "IPFS storage at 85% on eu-west-2 cluster", time: "22 min ago", action: "Expand" },
  { level: "warning" as const, message: "High latency detected on ap-east-1 (P99: 120ms)", time: "38 min ago", action: "Monitor" },
  { level: "warning" as const, message: "Certificate expiring in 7 days for us-west-2", time: "1h ago", action: "Renew" },
];

const levelConfig = {
  critical: {
    icon: AlertOctagon,
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    text: "text-destructive",
    badge: "bg-destructive/15 text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/10",
    border: "border-warning/20",
    text: "text-warning",
    badge: "bg-warning/15 text-warning",
  },
};

export function AlertsPanel() {
  const criticalCount = alerts.filter((a) => a.level === "critical").length;
  const warningCount = alerts.filter((a) => a.level === "warning").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Bell className="w-4 h-4 text-warning" />
        <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/15 text-destructive tabular-nums font-medium">{criticalCount}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-warning/15 text-warning tabular-nums font-medium">{warningCount}</span>
        </div>
      </div>
      <div className="divide-y divide-border max-h-80 overflow-auto">
        {alerts.map((alert, i) => {
          const config = levelConfig[alert.level];
          const Icon = config.icon;
          return (
            <div key={i} className={`px-5 py-3 flex items-start gap-3 hover:bg-primary/5 transition-colors duration-150`}>
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-3.5 h-3.5 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-foreground leading-relaxed">{alert.message}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{alert.time}</div>
              </div>
              <button className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors shrink-0 mt-0.5">
                {alert.action}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
