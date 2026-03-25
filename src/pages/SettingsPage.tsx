import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Shield, Database, Palette, Globe, Key,
  Save, ChevronRight, Moon, Sun, Monitor,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] } },
};

type SettingsTab = "general" | "notifications" | "security" | "cluster" | "appearance";

const tabs: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
  { key: "general", label: "General", icon: User },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "cluster", label: "Cluster", icon: Database },
];

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const { theme, toggleTheme } = useTheme();

  useKeyboardShortcuts(() => setCommandOpen(true));

  // Form states
  const [clusterName, setClusterName] = useState("chainbackup-prod-01");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [retentionDays, setRetentionDays] = useState("90");
  const [autoScale, setAutoScale] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully", { description: "Your changes have been applied." });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Cluster Name</label>
                  <input
                    value={clusterName}
                    onChange={(e) => setClusterName(e.target.value)}
                    className="w-full max-w-md h-9 px-3 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-9 px-3 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none text-foreground"
                  >
                    <option value="UTC">UTC</option>
                    <option value="US/Eastern">US/Eastern</option>
                    <option value="US/Pacific">US/Pacific</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Data Retention</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(e.target.value)}
                      className="w-24 h-9 px-3 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none text-foreground tabular-nums"
                    />
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Appearance</h3>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { key: "light", label: "Light", icon: Sun },
                { key: "dark", label: "Dark", icon: Moon },
                { key: "system", label: "System", icon: Monitor },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    if ((opt.key === "dark" && theme !== "dark") || (opt.key === "light" && theme !== "light")) toggleTheme();
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl ring-1 transition-all",
                    (theme === opt.key || (opt.key === "system" && false))
                      ? "ring-primary bg-primary/5 text-primary"
                      : "ring-border text-muted-foreground hover:ring-primary/40 hover:bg-muted/50"
                  )}
                >
                  <opt.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4 max-w-md">
              <ToggleRow label="Email Notifications" desc="Receive alerts via email" value={emailNotifs} onChange={setEmailNotifs} />
              <ToggleRow label="Slack Notifications" desc="Post alerts to Slack channel" value={slackNotifs} onChange={setSlackNotifs} />
              <ToggleRow label="Critical Alerts Only" desc="Only notify for critical severity" value={criticalOnly} onChange={setCriticalOnly} />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Security & Authentication</h3>
            <div className="space-y-4 max-w-md">
              <ToggleRow label="Two-Factor Authentication" desc="Require 2FA for all admin users" value={twoFactor} onChange={setTwoFactor} />
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Session Timeout</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-24 h-9 px-3 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none text-foreground tabular-nums"
                  />
                  <span className="text-xs text-muted-foreground">minutes</span>
                </div>
              </div>
              <div className="p-4 rounded-xl ring-1 ring-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">API Keys</div>
                    <div className="text-xs text-muted-foreground">3 active keys · Last rotated 12 days ago</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </div>
              </div>
            </div>
          </div>
        );

      case "cluster":
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Cluster Configuration</h3>
            <div className="space-y-4 max-w-md">
              <ToggleRow label="Auto-Scale Nodes" desc="Automatically provision nodes under high load" value={autoScale} onChange={setAutoScale} />
              <div className="p-4 rounded-xl ring-1 ring-border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Replication Factor</span>
                  <span className="text-sm font-medium text-foreground tabular-nums">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Consensus Protocol</span>
                  <span className="text-sm font-medium text-foreground">Raft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Heartbeat Interval</span>
                  <span className="text-sm font-medium text-foreground tabular-nums">500ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Max Nodes</span>
                  <span className="text-sm font-medium text-foreground tabular-nums">64</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenCommand={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={fadeUp} className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Configure your ChainBackup cluster</p>
              </div>
              <button
                onClick={handleSave}
                className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-glass"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-6">
              {/* Tab nav */}
              <div className="w-48 shrink-0 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                      activeTab === tab.key
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 glass-surface shadow-glass-md rounded-xl p-6 min-h-[400px]">
                {renderContent()}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg ring-1 ring-border hover:bg-muted/30 transition-colors">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "w-10 h-5.5 rounded-full transition-colors relative",
          value ? "bg-primary" : "bg-muted"
        )}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-white absolute top-0.5"
          animate={{ left: value ? 22 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
