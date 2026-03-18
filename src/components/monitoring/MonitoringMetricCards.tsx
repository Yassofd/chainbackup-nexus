import { useEffect, useState } from "react";
import { Cpu, MemoryStick, HardDrive, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: number;
  unit: string;
  icon: typeof Cpu;
  color: string;
  warn: number;
  crit: number;
}

const baseMetrics: Metric[] = [
  { label: "CPU", value: 62, unit: "%", icon: Cpu, color: "text-primary", warn: 75, crit: 90 },
  { label: "Memory", value: 74, unit: "%", icon: MemoryStick, color: "text-accent", warn: 80, crit: 95 },
  { label: "Disk I/O", value: 312, unit: " MB/s", icon: HardDrive, color: "text-success", warn: 400, crit: 480 },
  { label: "Latency", value: 8.4, unit: " ms", icon: Wifi, color: "text-warning", warn: 20, crit: 50 },
];

export function MonitoringMetricCards() {
  const [metrics, setMetrics] = useState(baseMetrics);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: +(m.value + (Math.random() - 0.5) * (m.label === "Disk I/O" ? 20 : m.label === "Latency" ? 1.5 : 4)).toFixed(m.label === "Latency" ? 1 : 0),
        }))
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m) => {
        const severity = m.value >= m.crit ? "crit" : m.value >= m.warn ? "warn" : "ok";
        return (
          <div key={m.label} className="glass-surface shadow-glass rounded-xl p-4 flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              severity === "crit" ? "bg-destructive/10" : severity === "warn" ? "bg-warning/10" : "bg-muted"
            )}>
              <m.icon className={cn("w-5 h-5", severity === "crit" ? "text-destructive" : severity === "warn" ? "text-warning" : m.color)} />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className={cn(
                "text-lg font-semibold tabular-nums",
                severity === "crit" ? "text-destructive" : severity === "warn" ? "text-warning" : "text-foreground"
              )}>
                {m.value}{m.unit}
              </div>
            </div>
            {severity !== "ok" && (
              <div className={cn(
                "ml-auto w-2 h-2 rounded-full shrink-0 status-pulse",
                severity === "crit" ? "bg-destructive" : "bg-warning"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
