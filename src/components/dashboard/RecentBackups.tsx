import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Archive } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

const backups = [
  { id: "bkp-2847", node: "us-east-1-a", status: "completed" as const, size: "24.8 GB", duration: "4m 12s", time: "2 min ago" },
  { id: "bkp-2846", node: "eu-west-2-b", status: "completed" as const, size: "18.2 GB", duration: "3m 08s", time: "8 min ago" },
  { id: "bkp-2845", node: "ap-south-1", status: "failed" as const, size: "—", duration: "1m 44s", time: "14 min ago" },
  { id: "bkp-2844", node: "us-west-2-c", status: "completed" as const, size: "31.5 GB", duration: "5m 22s", time: "22 min ago" },
  { id: "bkp-2843", node: "eu-central-1", status: "syncing" as const, size: "12.1 GB", duration: "2m 01s", time: "28 min ago" },
  { id: "bkp-2842", node: "us-east-1-b", status: "completed" as const, size: "8.4 GB", duration: "1m 38s", time: "35 min ago" },
];

const statusIcons = {
  completed: CheckCircle,
  failed: XCircle,
  syncing: Clock,
  active: Clock,
  pending: Clock,
};

export function RecentBackups() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Archive className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Recent Backups</h2>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">Last 1h</span>
      </div>
      <div className="divide-y divide-border">
        {backups.map((b) => {
          const Icon = statusIcons[b.status];
          return (
            <div
              key={b.id}
              className="px-5 py-3 flex items-center gap-4 hover:bg-primary/5 transition-colors duration-150"
            >
              <Icon className={`w-4 h-4 shrink-0 ${b.status === "failed" ? "text-destructive" : b.status === "syncing" ? "text-primary" : "text-success"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tabular-nums text-foreground">{b.id}</span>
                  <StatusBadge status={b.status} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{b.node}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs tabular-nums text-foreground">{b.size}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">{b.duration} · {b.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
