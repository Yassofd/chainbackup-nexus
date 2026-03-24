import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Network,
  Activity,
  Users,
  RotateCcw,
  Search,
  Zap,
  Settings,
  ShieldCheck,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commands = [
  { icon: LayoutDashboard, label: "Go to Dashboard", path: "/", shortcut: "Alt+1", category: "Navigation" },
  { icon: Database, label: "Go to Backups", path: "/backups", shortcut: "Alt+2", category: "Navigation" },
  { icon: Network, label: "Go to Network", path: "/network", shortcut: "Alt+3", category: "Navigation" },
  { icon: Activity, label: "Go to Monitoring", path: "/monitoring", shortcut: "Alt+4", category: "Navigation" },
  { icon: Users, label: "Go to Users", path: "/users", shortcut: "Alt+5", category: "Navigation" },
  { icon: RotateCcw, label: "Go to Restore", path: "/restore", shortcut: "Alt+6", category: "Navigation" },
  { icon: Zap, label: "Create New Backup", path: "/backups", shortcut: "", category: "Actions" },
  { icon: ShieldCheck, label: "Run Integrity Check", path: "/", shortcut: "", category: "Actions" },
  { icon: Settings, label: "Open Settings", path: "/settings", shortcut: "", category: "Actions" },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        navigate(filtered[selectedIndex].path);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="glass-surface shadow-glass-md rounded-xl border border-border overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Type a command or search…"
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-auto py-2">
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results found</div>
                )}
                {["Navigation", "Actions"].map((cat) => {
                  const items = filtered.filter((c) => c.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{cat}</div>
                      {items.map((cmd) => {
                        const globalIndex = filtered.indexOf(cmd);
                        const Icon = cmd.icon;
                        return (
                          <button
                            key={cmd.label}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            onClick={() => { navigate(cmd.path); onClose(); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              globalIndex === selectedIndex
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1 text-left">{cmd.label}</span>
                            {cmd.shortcut && (
                              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
                <span><kbd className="px-1 py-0.5 rounded bg-muted font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1 py-0.5 rounded bg-muted font-mono">↵</kbd> Select</span>
                <span><kbd className="px-1 py-0.5 rounded bg-muted font-mono">ESC</kbd> Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
