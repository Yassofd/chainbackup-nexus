import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "@/hooks/use-theme";

const nodes = ["us-east-1", "eu-west-2", "ap-south-1", "us-west-2", "eu-central", "ap-east-1"];

function generateData() {
  return nodes.map((n) => ({
    node: n,
    p50: +(2 + Math.random() * 8).toFixed(1),
    p95: +(10 + Math.random() * 30).toFixed(1),
    p99: +(20 + Math.random() * 60).toFixed(1),
  }));
}

export function LatencyHeatmap() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState(generateData);

  useEffect(() => {
    const timer = setInterval(() => setData(generateData()), 5000);
    return () => clearInterval(timer);
  }, []);

  const gridColor = isDark ? "hsl(220, 14%, 16%)" : "hsl(214, 20%, 92%)";
  const axisColor = isDark ? "hsl(215, 14%, 45%)" : "hsl(215, 14%, 55%)";

  return (
    <div className="glass-surface shadow-glass-md rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Network Latency</h3>
          <span className="text-xs text-muted-foreground">Per-node percentiles (ms)</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary inline-block" /> p50</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent inline-block" /> p95</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-warning inline-block" /> p99</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="node" tick={{ fontSize: 9, fill: axisColor }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false} unit=" ms" />
          <Tooltip
            contentStyle={{
              background: isDark ? "hsl(220, 15%, 12%)" : "hsl(0, 0%, 100%)",
              border: `1px solid ${isDark ? "hsl(220, 14%, 20%)" : "hsl(214, 20%, 90%)"}`,
              borderRadius: 8, fontSize: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
          <Bar dataKey="p50" fill="hsl(226, 70%, 55%)" radius={[3, 3, 0, 0]} barSize={10} />
          <Bar dataKey="p95" fill="hsl(270, 70%, 60%)" radius={[3, 3, 0, 0]} barSize={10} />
          <Bar dataKey="p99" fill="hsl(38, 92%, 50%)" radius={[3, 3, 0, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
