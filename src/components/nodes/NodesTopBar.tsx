import { motion } from "framer-motion";
import { Server, Crown, Wifi, WifiOff, RefreshCw, ShieldCheck } from "lucide-react";

interface Props {
  total: number;
  online: number;
  syncing: number;
  offline: number;
  masterLabel: string;
}

const items = (p: Props) => [
  { icon: Server, label: "Total Nodes", value: String(p.total), sub: "across 4 regions", color: "text-primary" },
  { icon: Wifi, label: "Online", value: String(p.online), sub: "healthy", color: "text-success" },
  { icon: RefreshCw, label: "Syncing", value: String(p.syncing), sub: "replicating", color: "text-warning" },
  { icon: WifiOff, label: "Offline", value: String(p.offline), sub: "unreachable", color: "text-destructive" },
  { icon: Crown, label: "Master Node", value: p.masterLabel, sub: "current leader", color: "text-accent" },
  { icon: ShieldCheck, label: "Health Score", value: `${Math.round(((p.online + p.syncing * 0.5) / p.total) * 100)}%`, sub: "cluster health", color: "text-success" },
];

export function NodesTopBar(props: Props) {
  const data = items(props);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
      className="border-b border-border glass-surface"
    >
      <div className="grid grid-cols-3 lg:grid-cols-6 divide-x divide-border">
        {data.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="px-4 py-3 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-[11px] text-muted-foreground">{item.label}</span>
            </div>
            <div className="text-base font-semibold tabular-nums text-foreground tracking-tight truncate">{item.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
