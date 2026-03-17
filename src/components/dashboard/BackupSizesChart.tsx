import { motion } from "framer-motion";
import { Archive } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const data = [
  { node: "us-e1", size: 24.8 },
  { node: "eu-w2", size: 18.2 },
  { node: "ap-s1", size: 14.5 },
  { node: "us-w2", size: 31.5 },
  { node: "eu-c1", size: 12.1 },
  { node: "ap-e1", size: 22.3 },
  { node: "sa-e1", size: 8.4 },
  { node: "us-e1b", size: 19.7 },
];

export function BackupSizesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Archive className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-semibold text-foreground">Backup Sizes by Node</h2>
      </div>
      <div className="p-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(226 70% 55%)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="hsl(270 70% 60%)" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="node" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={35} unit=" GB" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value} GB`, "Size"]}
            />
            <Bar dataKey="size" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
