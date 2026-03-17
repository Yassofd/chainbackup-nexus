import { motion } from "framer-motion";
import { Cpu, MemoryStick, Timer, HardDrive } from "lucide-react";

interface GaugeProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  detail: string;
  color: string;
  delay?: number;
}

function RadialGauge({ label, value, unit, icon: Icon, detail, color, delay = 0 }: GaugeProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl p-4 flex flex-col items-center"
    >
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: delay + 0.2, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold tabular-nums text-foreground">{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <span className="text-[11px] text-muted-foreground mt-0.5">{detail}</span>
    </motion.div>
  );
}

export function RealtimeMetrics() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <RadialGauge
        label="CPU Usage"
        value={67}
        unit="%"
        icon={Cpu}
        detail="Avg across 42 nodes"
        color="hsl(226 70% 55%)"
        delay={0.1}
      />
      <RadialGauge
        label="RAM Usage"
        value={74}
        unit="%"
        icon={MemoryStick}
        detail="31.2 GB / 42 GB"
        color="hsl(270 70% 60%)"
        delay={0.18}
      />
      <RadialGauge
        label="Network Latency"
        value={24}
        unit="ms avg"
        icon={Timer}
        detail="P99: 48ms"
        color="hsl(142 71% 45%)"
        delay={0.26}
      />
      <RadialGauge
        label="IPFS Storage"
        value={58}
        unit="%"
        icon={HardDrive}
        detail="698 GB / 1.2 TB"
        color="hsl(38 92% 50%)"
        delay={0.34}
      />
    </div>
  );
}
