import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, MemoryStick, HardDrive, Wifi, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThresholdRow {
  metric: string;
  icon: typeof Cpu;
  warn: number;
  crit: number;
  unit: string;
}

const defaults: ThresholdRow[] = [
  { metric: "CPU Usage", icon: Cpu, warn: 75, crit: 90, unit: "%" },
  { metric: "Memory Usage", icon: MemoryStick, warn: 80, crit: 95, unit: "%" },
  { metric: "Disk I/O", icon: HardDrive, warn: 400, crit: 480, unit: " MB/s" },
  { metric: "Network Latency", icon: Wifi, warn: 20, crit: 50, unit: " ms" },
];

export function ThresholdConfig({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState(defaults);
  const [saved, setSaved] = useState(false);

  const update = (idx: number, field: "warn" | "crit", val: string) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: Number(val) || 0 } : r)));
    setSaved(false);
  };

  const save = () => setSaved(true);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Alert Thresholds</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map((row, i) => (
            <div key={row.metric} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 ring-1 ring-border">
              <row.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground">{row.metric}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <label className="text-[10px] text-warning shrink-0 w-8">Warn</label>
                  <input
                    type="number"
                    value={row.warn}
                    onChange={(e) => update(i, "warn", e.target.value)}
                    className="w-16 h-7 px-2 text-xs bg-muted/50 rounded ring-1 ring-border focus:ring-primary/50 outline-none tabular-nums text-foreground"
                  />
                  <label className="text-[10px] text-destructive shrink-0 w-8 ml-2">Crit</label>
                  <input
                    type="number"
                    value={row.crit}
                    onChange={(e) => update(i, "crit", e.target.value)}
                    className="w-16 h-7 px-2 text-xs bg-muted/50 rounded ring-1 ring-border focus:ring-primary/50 outline-none tabular-nums text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground">{row.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          {saved && <span className="text-xs text-success">Thresholds saved ✓</span>}
          <button
            onClick={save}
            className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-glass"
          >
            <Save className="w-3.5 h-3.5" /> Save Thresholds
          </button>
        </div>
      </div>
    </motion.div>
  );
}
