import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { MiniSparkline } from "./MiniSparkline";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  sparkData?: number[];
  delay?: number;
}

export function MetricCard({ title, value, change, trend, icon: Icon, sparkData, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -2 }}
      className="glass-surface shadow-glass-md rounded-xl p-5 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium tabular-nums ${trend === "up" ? "text-success" : "text-destructive"}`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>

      <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground" style={{ letterSpacing: "-0.04em" }}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{title}</div>

      {sparkData && (
        <div className="mt-3 h-8">
          <MiniSparkline data={sparkData} />
        </div>
      )}
    </motion.div>
  );
}
