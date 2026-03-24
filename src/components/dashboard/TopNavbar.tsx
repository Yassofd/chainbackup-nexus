import { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useLiveClock } from "@/hooks/use-live-data";

interface TopNavbarProps {
  onOpenCommand?: () => void;
}

export function TopNavbar({ onOpenCommand }: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const time = useLiveClock();
  const [notifCount, setNotifCount] = useState(3);
  const [notifPulse, setNotifPulse] = useState(false);

  // Simulate incoming notification
  useEffect(() => {
    const id = setInterval(() => {
      setNotifCount((c) => c + 1);
      setNotifPulse(true);
      setTimeout(() => setNotifPulse(false), 600);
    }, 25000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 border-b border-border glass-surface flex items-center justify-between px-6 z-10">
      {/* Search */}
      <button
        onClick={onOpenCommand}
        className="relative w-80 h-9 pl-9 pr-4 text-sm bg-muted/50 rounded-lg ring-1 ring-border hover:ring-primary/50 transition-all text-muted-foreground text-left flex items-center group"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span>Search nodes, jobs, backups…</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">⌘K</kbd>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Live clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
          <Zap className="w-3 h-3 text-success" />
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>

        <div className="w-px h-5 bg-border hidden md:block" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative overflow-hidden"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0, scale: 0 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors relative text-muted-foreground hover:text-foreground">
          <motion.div animate={notifPulse ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
            <Bell className="w-4 h-4" />
          </motion.div>
          <AnimatePresence>
            {notifCount > 0 && (
              <motion.span
                key={notifCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground tabular-nums"
              >
                {notifCount > 9 ? "9+" : notifCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary ring-2 ring-background ring-offset-2 ring-offset-success/60 cursor-pointer"
        >
          SB
        </motion.div>
      </div>
    </header>
  );
}
