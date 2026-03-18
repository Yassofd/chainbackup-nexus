import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HardDrive,
  Network,
  ShieldCheck,
  Settings,
  Activity,
  Database,
  ChevronLeft,
  ChevronRight,
  Cpu,
  RotateCcw,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", count: null },
  { icon: HardDrive, label: "Nodes", path: "/nodes", count: 42 },
  { icon: Database, label: "Backups", path: "/backups", count: 156 },
  { icon: RotateCcw, label: "Restore", path: "/restore", count: null },
  { icon: Network, label: "Network", path: "/network", count: null },
  { icon: Activity, label: "Monitoring", path: "/monitoring", count: null },
  { icon: ShieldCheck, label: "Security", path: "/security", count: null },
  { icon: Cpu, label: "Resources", path: "/resources", count: null },
  { icon: Settings, label: "Settings", path: "/settings", count: null },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-screen glass-surface shadow-glass border-r border-border flex flex-col relative z-20 shrink-0"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-semibold tracking-tight whitespace-nowrap text-foreground"
              >
                ChainBackup
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150
                ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 text-left whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.count !== null && (
                <span className="text-xs tabular-nums bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage Quota */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Storage Used</div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="progress-bar-inner" style={{ width: "67%" }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5 tabular-nums">
            804 GB / 1.2 TB
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-card shadow-glass-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
}
