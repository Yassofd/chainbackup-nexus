import { motion } from "framer-motion";

const regions = [
  { name: "US East", nodes: 12, health: 100, x: 28, y: 38 },
  { name: "US West", nodes: 8, health: 97, x: 15, y: 40 },
  { name: "EU West", nodes: 6, health: 100, x: 48, y: 32 },
  { name: "EU Central", nodes: 4, health: 100, x: 52, y: 30 },
  { name: "AP South", nodes: 5, health: 95, x: 68, y: 48 },
  { name: "AP East", nodes: 4, health: 100, x: 78, y: 38 },
  { name: "SA East", nodes: 3, health: 100, x: 32, y: 65 },
];

export function NodeDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Node Distribution</h2>
      </div>
      <div className="p-5">
        {/* Simplified map representation */}
        <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-foreground" style={{ top: `${(i + 1) * 14}%` }} />
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-foreground" style={{ left: `${(i + 1) * 11}%` }} />
            ))}
          </div>

          {/* Node dots */}
          {regions.map((region) => (
            <motion.div
              key={region.name}
              className="absolute group"
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + regions.indexOf(region) * 0.08, type: "spring" }}
            >
              {/* Pulse ring */}
              <div className="absolute -inset-3 rounded-full bg-primary/20 status-pulse" />
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/30 relative z-10" />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md bg-card shadow-glass-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-border">
                <div className="font-medium text-foreground">{region.name}</div>
                <div className="text-muted-foreground tabular-nums">{region.nodes} nodes · {region.health}% health</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {regions.slice(0, 4).map((r) => (
            <div key={r.name} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{r.name}</span>
              <span className="tabular-nums ml-auto">{r.nodes}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
