import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", throughput: 320, backups: 12 },
  { time: "02:00", throughput: 180, backups: 8 },
  { time: "04:00", throughput: 140, backups: 5 },
  { time: "06:00", throughput: 220, backups: 9 },
  { time: "08:00", throughput: 380, backups: 18 },
  { time: "10:00", throughput: 520, backups: 24 },
  { time: "12:00", throughput: 480, backups: 22 },
  { time: "14:00", throughput: 560, backups: 28 },
  { time: "16:00", throughput: 450, backups: 21 },
  { time: "18:00", throughput: 390, backups: 16 },
  { time: "20:00", throughput: 340, backups: 14 },
  { time: "22:00", throughput: 280, backups: 11 },
];

export function ThroughputChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Network Throughput (24h)</h2>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Throughput
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Backups
          </span>
        </div>
      </div>
      <div className="p-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(226 70% 55%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(226 70% 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="backupsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270 70% 60%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(270 70% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 20%)" strokeOpacity={0.3} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 15% 10%)",
                border: "1px solid hsl(220 14% 16%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210 20% 92%)",
              }}
            />
            <Area
              type="monotone"
              dataKey="throughput"
              stroke="hsl(226 70% 55%)"
              strokeWidth={2}
              fill="url(#throughputGrad)"
            />
            <Area
              type="monotone"
              dataKey="backups"
              stroke="hsl(270 70% 60%)"
              strokeWidth={2}
              fill="url(#backupsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
