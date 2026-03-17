import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const healthMetrics = [
  { label: "Replication Factor", value: "3x", status: "ok" },
  { label: "Data Integrity", value: "100%", status: "ok" },
  { label: "Encryption", value: "AES-256", status: "ok" },
  { label: "SSL Certificates", value: "Valid", status: "warning" },
  { label: "Consensus", value: "Raft OK", status: "ok" },
  { label: "Recovery Point", value: "< 5min", status: "ok" },
];

export function SystemHealth() {
  const score = 97.2;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-success" />
        <h2 className="text-sm font-semibold text-foreground">System Health</h2>
      </div>
      <div className="p-5 flex flex-col items-center">
        {/* Health Score Gauge */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="hsl(142 71% 45%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-bold tabular-nums text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {score}
            </motion.span>
            <span className="text-[10px] text-muted-foreground font-medium">HEALTH SCORE</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-2 gap-2">
          {healthMetrics.map((m) => (
            <div key={m.label} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/30">
              {m.status === "ok" ? (
                <CheckCircle className="w-3 h-3 text-success shrink-0" />
              ) : m.status === "warning" ? (
                <AlertTriangle className="w-3 h-3 text-warning shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 text-destructive shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-[11px] text-muted-foreground truncate">{m.label}</div>
                <div className="text-xs font-medium text-foreground tabular-nums">{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
