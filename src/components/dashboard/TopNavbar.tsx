import { Search, Bell, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border glass-surface flex items-center justify-between px-6 z-10">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search nodes, jobs, backups…  ⌘K"
          className="w-full h-9 pl-9 pr-4 text-sm bg-muted/50 rounded-lg border-0 ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
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
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary ring-2 ring-background ring-offset-2 ring-offset-success/60">
          SB
        </div>
      </div>
    </header>
  );
}
