import { useState } from "react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActiveJobsTable } from "@/components/dashboard/ActiveJobsTable";
import { ThroughputChart } from "@/components/dashboard/ThroughputChart";
import { NodeDistribution } from "@/components/dashboard/NodeDistribution";
import { HardDrive, ShieldCheck, Network, Activity } from "lucide-react";

const sparkData1 = [32, 28, 35, 40, 38, 42, 45, 43, 48, 50, 47, 52];
const sparkData2 = [99.2, 99.5, 99.8, 99.4, 99.9, 99.7, 99.95, 99.88, 99.92, 99.96, 99.91, 99.94];
const sparkData3 = [38, 39, 40, 41, 40, 42, 41, 42, 42, 43, 42, 42];
const sparkData4 = [280, 310, 350, 420, 380, 450, 390, 460, 440, 480, 450, 470];

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Hero Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              title="Total Protected Data"
              value="1.2 PB"
              change="+12.4%"
              trend="up"
              icon={HardDrive}
              sparkData={sparkData1}
              delay={0}
            />
            <MetricCard
              title="Global Success Rate"
              value="99.94%"
              change="+0.02%"
              trend="up"
              icon={ShieldCheck}
              sparkData={sparkData2}
              delay={0.08}
            />
            <MetricCard
              title="Active Nodes"
              value="42 / 43"
              change="-1 node"
              trend="down"
              icon={Network}
              sparkData={sparkData3}
              delay={0.16}
            />
            <MetricCard
              title="Network Throughput"
              value="450 MB/s"
              change="+8.2%"
              trend="up"
              icon={Activity}
              sparkData={sparkData4}
              delay={0.24}
            />
          </div>

          {/* Active Jobs */}
          <ActiveJobsTable />

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ThroughputChart />
            <NodeDistribution />
          </div>
        </main>
      </div>
    </div>
  );
}
