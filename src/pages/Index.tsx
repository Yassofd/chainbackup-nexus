import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { ClusterOverview } from "@/components/dashboard/ClusterOverview";
import { RealtimeMetrics } from "@/components/dashboard/RealtimeMetrics";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentBackups } from "@/components/dashboard/RecentBackups";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { OngoingJobs } from "@/components/dashboard/OngoingJobs";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { CpuRamChart } from "@/components/dashboard/CpuRamChart";
import { BackupSizesChart } from "@/components/dashboard/BackupSizesChart";
import { ThroughputChart } from "@/components/dashboard/ThroughputChart";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { MetricCardSkeleton, ClusterSkeleton, TableSkeleton, ChartSkeleton, GaugeSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSimulatedLoading } from "@/hooks/use-live-data";
import { HardDrive, ShieldCheck, Network, Activity } from "lucide-react";
import { toast } from "sonner";

const sparkData1 = [32, 28, 35, 40, 38, 42, 45, 43, 48, 50, 47, 52];
const sparkData2 = [99.2, 99.5, 99.8, 99.4, 99.9, 99.7, 99.95, 99.88, 99.92, 99.96, 99.91, 99.94];
const sparkData3 = [38, 39, 40, 41, 40, 42, 41, 42, 42, 43, 42, 42];
const sparkData4 = [280, 310, 350, 420, 380, 450, 390, 460, 440, 480, 450, 470];

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const loading = useSimulatedLoading(1400);

  useKeyboardShortcuts(() => setCommandOpen(true));

  // Simulate a live notification on mount
  useState(() => {
    const t = setTimeout(() => {
      toast.success("Backup BKP-2848 completed", {
        description: "us-east-1-a · 22.1 GB in 3m 42s",
      });
    }, 4000);
    return () => clearTimeout(t);
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] } },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenCommand={() => setCommandOpen(true)} />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                className="space-y-6"
              >
                <ClusterSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <MetricCardSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <div className="xl:col-span-2"><TableSkeleton rows={5} /></div>
                  <GaugeSkeleton />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className="space-y-6"
              >
                <motion.div variants={fadeIn}><ClusterOverview /></motion.div>

                <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <MetricCard title="Total Protected Data" value="1.2 PB" change="+12.4%" trend="up" icon={HardDrive} sparkData={sparkData1} delay={0} />
                  <MetricCard title="Global Success Rate" value="99.94%" change="+0.02%" trend="up" icon={ShieldCheck} sparkData={sparkData2} delay={0.08} />
                  <MetricCard title="Active Nodes" value="42 / 43" change="-1 node" trend="down" icon={Network} sparkData={sparkData3} delay={0.16} />
                  <MetricCard title="Network Throughput" value="450 MB/s" change="+8.2%" trend="up" icon={Activity} sparkData={sparkData4} delay={0.24} />
                </motion.div>

                <motion.div variants={fadeIn}><RealtimeMetrics /></motion.div>

                <motion.div variants={fadeIn} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <div className="xl:col-span-2"><OngoingJobs /></div>
                  <SystemHealth />
                </motion.div>

                <motion.div variants={fadeIn} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <CpuRamChart />
                  <BackupSizesChart />
                </motion.div>

                <motion.div variants={fadeIn} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <RecentBackups />
                  <AlertsPanel />
                  <ThroughputChart />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
