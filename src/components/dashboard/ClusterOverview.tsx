import { motion } from "framer-motion";
import { Server, Activity, Crown, Wifi } from "lucide-react";

const clusterData = [
  { label: "Total Nodes", value: "43", icon: Server, sub: "7 regions" },
  { label: "Active Nodes", value: "42", icon: Activity, sub: "1 offline", status: "warning" as const },
  { label: "Master Node", value: "us-east-1-a", icon: Crown, sub: "Uptime: 47d 12h" },
  { label: "Cluster Latency", value: "2.4ms", icon: Wifi, sub: "P99: 8.1ms" },
];

const statusColors = {
  ok: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

export function ClusterOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Server className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Cluster Status</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-success font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success status-pulse" />
          Healthy
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
        {clusterData.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            className="p-4 hover:bg-primary/5 transition-colors duration-150"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className="text-lg font-semibold tabular-nums text-foreground tracking-tight">
              {item.value}
            </div>
            <div className={`text-xs mt-0.5 ${item.status ? statusColors[item.status] : "text-muted-foreground"}`}>
              {item.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
