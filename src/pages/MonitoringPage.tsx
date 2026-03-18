import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Settings2 } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { MonitoringMetricCards } from "@/components/monitoring/MonitoringMetricCards";
import { MetricLineChart } from "@/components/monitoring/MetricLineChart";
import { AlertsFeed } from "@/components/monitoring/AlertsFeed";
import { ThresholdConfig } from "@/components/monitoring/ThresholdConfig";
import { LatencyHeatmap } from "@/components/monitoring/LatencyHeatmap";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] } } };

export default function MonitoringPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showThresholds, setShowThresholds] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Monitoring & Alerts
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Real-time infrastructure metrics and alert management</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 ring-1 ring-success/20">
                  <div className="w-2 h-2 rounded-full bg-success status-pulse" />
                  <span className="text-xs font-medium text-success">Live</span>
                </div>
                <button
                  onClick={() => setShowThresholds(!showThresholds)}
                  className="h-9 px-3 rounded-lg text-sm font-medium flex items-center gap-2 ring-1 ring-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Settings2 className="w-4 h-4" />
                  Thresholds
                </button>
              </div>
            </motion.div>

            {/* Threshold config panel */}
            {showThresholds && (
              <motion.div variants={fadeUp}>
                <ThresholdConfig onClose={() => setShowThresholds(false)} />
              </motion.div>
            )}

            {/* Metric cards */}
            <motion.div variants={fadeUp}>
              <MonitoringMetricCards />
            </motion.div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <motion.div variants={fadeUp}>
                <MetricLineChart
                  title="CPU Usage"
                  color="hsl(226, 70%, 55%)"
                  unit="%"
                  dataKey="cpu"
                  thresholdWarn={75}
                  thresholdCrit={90}
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <MetricLineChart
                  title="Memory Usage"
                  color="hsl(270, 70%, 60%)"
                  unit="%"
                  dataKey="ram"
                  thresholdWarn={80}
                  thresholdCrit={95}
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <MetricLineChart
                  title="Disk I/O"
                  color="hsl(142, 71%, 45%)"
                  unit=" MB/s"
                  dataKey="disk"
                  thresholdWarn={400}
                  thresholdCrit={480}
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <LatencyHeatmap />
              </motion.div>
            </div>

            {/* Alerts */}
            <motion.div variants={fadeUp}>
              <AlertsFeed />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
