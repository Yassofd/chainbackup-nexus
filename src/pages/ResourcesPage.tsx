import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, MemoryStick, HardDrive, Gauge, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] } },
};

/* ── Simulated time-series data ── */
function genTimeSeries(points: number, base: number, variance: number) {
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(Date.now() - (points - i) * 60000);
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: Math.max(0, Math.min(100, base + (Math.random() - 0.4) * variance)),
    };
  });
}

function genStorageSeries(points: number) {
  let used = 620;
  return Array.from({ length: points }, (_, i) => {
    used += Math.random() * 8;
    const t = new Date(Date.now() - (points - i) * 3600000);
    return {
      time: t.toLocaleDateString([], { month: "short", day: "numeric" }),
      used: Math.round(used),
      total: 1200,
    };
  });
}

const nodeRows = [
  { id: "node-01", label: "us-east-1-a", cpu: 62, ram: 71, disk: 58, latency: 1.2, status: "online" as const },
  { id: "node-02", label: "us-east-1-b", cpu: 78, ram: 83, disk: 64, latency: 2.1, status: "online" as const },
  { id: "node-03", label: "eu-west-2-b", cpu: 45, ram: 52, disk: 42, latency: 48.3, status: "online" as const },
  { id: "node-04", label: "eu-central-1", cpu: 91, ram: 88, disk: 76, latency: 52.1, status: "warning" as const },
  { id: "node-05", label: "ap-south-1", cpu: 0, ram: 0, disk: 35, latency: 0, status: "offline" as const },
  { id: "node-06", label: "us-west-2-c", cpu: 55, ram: 61, disk: 49, latency: 4.5, status: "online" as const },
  { id: "node-07", label: "ap-east-1", cpu: 34, ram: 47, disk: 38, latency: 85.2, status: "online" as const },
  { id: "node-08", label: "sa-east-1", cpu: 68, ram: 72, disk: 61, latency: 120.4, status: "online" as const },
];

type TimeRange = "1h" | "24h" | "7d";

export default function ResourcesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [sortField, setSortField] = useState<"cpu" | "ram" | "disk" | "latency">("cpu");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useKeyboardShortcuts(() => setCommandOpen(true));

  // Live-updating chart data
  const [cpuData, setCpuData] = useState(() => genTimeSeries(24, 58, 30));
  const [ramData, setRamData] = useState(() => genTimeSeries(24, 65, 20));
  const [storageData] = useState(() => genStorageSeries(14));
  const [latencyData, setLatencyData] = useState(() => genTimeSeries(24, 12, 25));

  useEffect(() => {
    const id = setInterval(() => {
      setCpuData((prev) => {
        const next = [...prev.slice(1)];
        const t = new Date();
        next.push({ time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: Math.max(5, Math.min(95, prev[prev.length - 1].value + (Math.random() - 0.45) * 8)) });
        return next;
      });
      setRamData((prev) => {
        const next = [...prev.slice(1)];
        const t = new Date();
        next.push({ time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: Math.max(10, Math.min(95, prev[prev.length - 1].value + (Math.random() - 0.48) * 5)) });
        return next;
      });
      setLatencyData((prev) => {
        const next = [...prev.slice(1)];
        const t = new Date();
        next.push({ time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), value: Math.max(1, Math.min(100, prev[prev.length - 1].value + (Math.random() - 0.5) * 12)) });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const sorted = [...nodeRows].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    return mul * (a[sortField] - b[sortField]);
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const avgCpu = Math.round(nodeRows.filter((n) => n.status !== "offline").reduce((s, n) => s + n.cpu, 0) / nodeRows.filter((n) => n.status !== "offline").length);
  const avgRam = Math.round(nodeRows.filter((n) => n.status !== "offline").reduce((s, n) => s + n.ram, 0) / nodeRows.filter((n) => n.status !== "offline").length);
  const avgLatency = (nodeRows.filter((n) => n.status !== "offline").reduce((s, n) => s + n.latency, 0) / nodeRows.filter((n) => n.status !== "offline").length).toFixed(1);

  const summaryCards = [
    { label: "Avg CPU Usage", value: `${avgCpu}%`, icon: Cpu, trend: avgCpu > 70 ? "up" : "down", color: avgCpu > 80 ? "text-destructive" : "text-primary" },
    { label: "Avg RAM Usage", value: `${avgRam}%`, icon: MemoryStick, trend: avgRam > 75 ? "up" : "down", color: avgRam > 85 ? "text-destructive" : "text-accent" },
    { label: "Storage Used", value: "804 GB / 1.2 TB", icon: HardDrive, trend: "up", color: "text-success" },
    { label: "Avg Latency", value: `${avgLatency} ms`, icon: Gauge, trend: parseFloat(avgLatency) > 50 ? "up" : "down", color: parseFloat(avgLatency) > 80 ? "text-warning" : "text-primary" },
  ];

  const chartTooltipStyle = {
    contentStyle: {
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      fontSize: "12px",
      color: "hsl(var(--foreground))",
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenCommand={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Resources
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Cluster-wide resource utilization and capacity planning</p>
              </div>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 ring-1 ring-border">
                {(["1h", "24h", "7d"] as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      timeRange === r ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="glass-surface shadow-glass-md rounded-xl p-5 group card-interactive">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <card.icon className={cn("w-4.5 h-4.5", card.color)} />
                    </div>
                    {card.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <div className="text-2xl font-semibold tabular-nums text-foreground" style={{ letterSpacing: "-0.04em" }}>
                    {card.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* CPU + RAM Chart */}
              <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">CPU & RAM Over Time</h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success/10 ring-1 ring-success/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-success status-pulse" />
                    <span className="text-[10px] font-medium text-success">Live</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip {...chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line dataKey="value" name="CPU" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Storage Growth */}
              <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Storage Growth</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 1200]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}GB`} />
                    <Tooltip {...chartTooltipStyle} />
                    <Area dataKey="used" name="Used" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.15)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Latency Chart */}
            <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Network Latency (ms)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}ms`} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line dataKey="value" name="Latency" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Node Resource Table */}
            <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Node Resource Allocation</h3>
                <span className="text-xs text-muted-foreground tabular-nums">{nodeRows.length} nodes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Node</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                      {(["cpu", "ram", "disk", "latency"] as const).map((f) => (
                        <th
                          key={f}
                          onClick={() => toggleSort(f)}
                          className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                        >
                          {f === "latency" ? "Latency" : f.toUpperCase()} %{sortField === f && (sortDir === "desc" ? " ↓" : " ↑")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((node) => (
                      <tr key={node.id} className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="py-3 px-5">
                          <div className="text-xs font-medium text-foreground">{node.label}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{node.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full",
                            node.status === "online" && "bg-success/10 text-success",
                            node.status === "warning" && "bg-warning/10 text-warning",
                            node.status === "offline" && "bg-destructive/10 text-destructive",
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              node.status === "online" && "bg-success",
                              node.status === "warning" && "bg-warning",
                              node.status === "offline" && "bg-destructive",
                            )} />
                            {node.status}
                          </span>
                        </td>
                        {(["cpu", "ram", "disk"] as const).map((metric) => (
                          <td key={metric} className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    node[metric] > 85 ? "bg-destructive" : node[metric] > 70 ? "bg-warning" : "bg-primary"
                                  )}
                                  style={{ width: `${node[metric]}%` }}
                                />
                              </div>
                              <span className={cn(
                                "text-xs tabular-nums font-medium",
                                node[metric] > 85 ? "text-destructive" : "text-foreground"
                              )}>
                                {node[metric]}%
                              </span>
                              {node[metric] > 85 && <AlertTriangle className="w-3 h-3 text-destructive" />}
                            </div>
                          </td>
                        ))}
                        <td className="py-3 px-4">
                          <span className={cn(
                            "text-xs tabular-nums font-medium",
                            node.latency > 100 ? "text-warning" : "text-foreground"
                          )}>
                            {node.latency} ms
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
