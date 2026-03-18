import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { useTheme } from "@/hooks/use-theme";

interface Props {
  title: string;
  color: string;
  unit: string;
  dataKey: string;
  thresholdWarn: number;
  thresholdCrit: number;
}

function generateSeed(key: string) {
  const bases: Record<string, { base: number; variance: number }> = {
    cpu: { base: 62, variance: 15 },
    ram: { base: 74, variance: 10 },
    disk: { base: 312, variance: 60 },
  };
  return bases[key] ?? { base: 62, variance: 15 };
}

function generateHistory(key: string) {
  const { base, variance } = generateSeed(key);
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({
    time: new Date(now - (29 - i) * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: +(base + (Math.random() - 0.4) * variance).toFixed(1),
  }));
}

export function MetricLineChart({ title, color, unit, dataKey, thresholdWarn, thresholdCrit }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState(() => generateHistory(dataKey));

  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1].value;
        const { variance } = generateSeed(dataKey);
        const next = +(last + (Math.random() - 0.48) * (variance * 0.3)).toFixed(1);
        return [
          ...prev.slice(1),
          { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: Math.max(0, next) },
        ];
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [dataKey]);

  const latest = data[data.length - 1]?.value ?? 0;
  const gridColor = isDark ? "hsl(220, 14%, 16%)" : "hsl(214, 20%, 92%)";
  const axisColor = isDark ? "hsl(215, 14%, 45%)" : "hsl(215, 14%, 55%)";

  return (
    <div className="glass-surface shadow-glass-md rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground">Last 30 min</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold tabular-nums text-foreground">{latest}{unit}</div>
          <div className="text-[10px] text-muted-foreground tabular-nums">warn {thresholdWarn} · crit {thresholdCrit}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: isDark ? "hsl(220, 15%, 12%)" : "hsl(0, 0%, 100%)",
              border: `1px solid ${isDark ? "hsl(220, 14%, 20%)" : "hsl(214, 20%, 90%)"}`,
              borderRadius: 8,
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            formatter={(val: number) => [`${val}${unit}`, title]}
          />
          <ReferenceLine y={thresholdWarn} stroke="hsl(38, 92%, 50%)" strokeDasharray="4 4" strokeOpacity={0.6} />
          <ReferenceLine y={thresholdCrit} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeOpacity={0.6} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} dot={false} activeDot={{ r: 3, strokeWidth: 0, fill: color }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
