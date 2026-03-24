import { motion } from "framer-motion";
import {
  X, Cpu, MemoryStick, Timer, Server, Wifi, HardDrive, Clock, MapPin,
  Power, RotateCcw, FileText, AlertTriangle,
} from "lucide-react";
import { NetworkNode } from "@/data/networkNodes";
import { toast } from "sonner";

interface Props {
  node: NetworkNode;
  onClose: () => void;
}

export function NodeDetailsDrawer({ node, onClose }: Props) {
  const isOnline = node.status !== "offline";
  const isSyncing = node.status === "syncing";

  const handleAction = (action: string) => {
    toast.success(`${action} initiated`, { description: `Target: ${node.label} (${node.ip})` });
  };

  return (
    <motion.div
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
      className="w-[340px] h-full glass-surface border-l border-border shadow-glass-md flex flex-col z-30 shrink-0"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          !isOnline ? "bg-destructive" : isSyncing ? "bg-warning status-pulse" : "bg-success status-pulse"
        }`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{node.label}</div>
          <div className="text-xs text-muted-foreground font-mono">{node.ip}</div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
          node.role === "master"
            ? "bg-accent/15 text-accent ring-1 ring-accent/20"
            : "bg-muted text-muted-foreground"
        }`}>
          {node.role.toUpperCase()}
        </span>
        <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* Status */}
        <div className={`rounded-lg p-3 flex items-center gap-3 ${
          !isOnline ? "bg-destructive/10 ring-1 ring-destructive/20" :
          isSyncing ? "bg-warning/10 ring-1 ring-warning/20" :
          "bg-success/10 ring-1 ring-success/20"
        }`}>
          <Server className={`w-4 h-4 ${!isOnline ? "text-destructive" : isSyncing ? "text-warning" : "text-success"}`} />
          <div>
            <div className={`text-xs font-medium ${!isOnline ? "text-destructive" : isSyncing ? "text-warning" : "text-success"}`}>
              {!isOnline ? "Node Offline" : isSyncing ? "Node Syncing" : "Node Online"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {!isOnline ? "Unreachable since 3h ago" : isSyncing ? "Replicating data…" : `Connected · ${node.connections} peers`}
            </div>
          </div>
        </div>

        {/* Metrics */}
        {isOnline && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</h3>
            <GaugeMetric icon={Cpu} label="CPU Usage" value={Math.round(node.cpu)} unit="%" color={node.cpu > 80 ? "destructive" : node.cpu > 60 ? "warning" : "success"} />
            <GaugeMetric icon={MemoryStick} label="RAM Usage" value={Math.round(node.ram)} unit="%" color={node.ram > 80 ? "destructive" : "accent"} />
            <GaugeMetric icon={HardDrive} label="Disk Usage" value={Math.round(node.disk)} unit="%" color={node.disk > 80 ? "destructive" : node.disk > 60 ? "warning" : "primary"} />
            <GaugeMetric icon={Timer} label="Latency" value={Number(node.latency.toFixed(1))} unit="ms" color="primary" max={100} />
          </div>
        )}

        {/* Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Information</h3>
          <div className="grid grid-cols-2 gap-2">
            <InfoCard icon={MapPin} label="Region" value={node.region} />
            <InfoCard icon={Clock} label="Uptime" value={node.uptime} />
            <InfoCard icon={Wifi} label="Connections" value={String(node.connections)} />
            <InfoCard icon={HardDrive} label="Last Backup" value={node.lastBackup} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Actions</h3>
          <button
            onClick={() => handleAction("View Logs")}
            className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            View Logs
          </button>
          <button
            onClick={() => handleAction("Restart")}
            className="w-full h-9 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Node
          </button>
          {isOnline && (
            <button
              onClick={() => handleAction("Drain")}
              className="w-full h-9 rounded-lg bg-warning/10 text-warning text-xs font-medium hover:bg-warning/20 transition-colors ring-1 ring-warning/20 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Drain Node
            </button>
          )}
          {!isOnline && (
            <button
              onClick={() => handleAction("Reconnect")}
              className="w-full h-9 rounded-lg bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors ring-1 ring-success/20 flex items-center justify-center gap-2"
            >
              <Power className="w-3.5 h-3.5" />
              Attempt Reconnect
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function GaugeMetric({ icon: Icon, label, value, unit, color, max = 100 }: {
  icon: React.ElementType; label: string; value: number; unit: string; color: string; max?: number;
}) {
  const percent = Math.min((value / max) * 100, 100);
  const colorClass: Record<string, string> = {
    destructive: "bg-destructive", warning: "bg-warning", success: "bg-success", accent: "bg-accent", primary: "bg-primary",
  };

  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-xs font-medium tabular-nums text-foreground">{value}{unit}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colorClass[color] || "bg-primary"}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <div className="text-xs font-medium text-foreground tabular-nums">{value}</div>
    </div>
  );
}
