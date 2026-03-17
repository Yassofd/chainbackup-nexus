import { motion } from "framer-motion";
import { Cpu, MemoryStick } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const data = [
  { time: "00:00", cpu: 42, ram: 58 },
  { time: "02:00", cpu: 38, ram: 56 },
  { time: "04:00", cpu: 35, ram: 54 },
  { time: "06:00", cpu: 45, ram: 60 },
  { time: "08:00", cpu: 62, ram: 68 },
  { time: "10:00", cpu: 78, ram: 74 },
  { time: "12:00", cpu: 72, ram: 72 },
  { time: "14:00", cpu: 80, ram: 76 },
  { time: "16:00", cpu: 68, ram: 70 },
  { time: "18:00", cpu: 58, ram: 66 },
  { time: "20:00", cpu: 52, ram: 62 },
  { time: "22:00", cpu: 48, ram: 60 },
];

export function CpuRamChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">CPU & RAM Usage (24h)</h2>
        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            CPU
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            RAM
          </span>
        </div>
      </div>
      <div className="p-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(226 70% 55%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(226 70% 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270 70% 60%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(270 70% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={35} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Area type="monotone" dataKey="cpu" stroke="hsl(226 70% 55%)" strokeWidth={2} fill="url(#cpuGrad)" />
            <Area type="monotone" dataKey="ram" stroke="hsl(270 70% 60%)" strokeWidth={2} fill="url(#ramGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
