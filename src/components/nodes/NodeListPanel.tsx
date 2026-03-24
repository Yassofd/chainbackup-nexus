import { motion } from "framer-motion";
import { Search, Cpu, MemoryStick, Crown } from "lucide-react";
import { NetworkNode } from "@/data/networkNodes";

interface Props {
  nodes: NetworkNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: NetworkNode) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const statusFilters = [
  { value: "all", label: "All" },
  { value: "online", label: "Online" },
  { value: "syncing", label: "Syncing" },
  { value: "offline", label: "Offline" },
];

const statusDot: Record<string, string> = {
  online: "bg-success",
  syncing: "bg-warning",
  offline: "bg-destructive",
};

const statusLabel: Record<string, string> = {
  online: "text-success",
  syncing: "text-warning",
  offline: "text-destructive",
};

export function NodeListPanel({ nodes, selectedNodeId, onSelectNode, filterStatus, onFilterChange, searchQuery, onSearchChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
      className="w-[280px] border-r border-border glass-surface flex flex-col shrink-0"
    >
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search nodes…"
            className="w-full h-8 pl-8 pr-3 text-xs bg-muted/50 rounded-md ring-1 ring-border focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-1">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filterStatus === f.value
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-auto">
        {nodes.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground">No nodes match filter</div>
        )}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`w-full px-3 py-2.5 text-left border-b border-border transition-all duration-150 ${
                isSelected
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : "hover:bg-muted/50 border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[node.status]}`} />
                <span className="text-xs font-medium text-foreground truncate flex-1">{node.label}</span>
                {node.role === "master" && (
                  <Crown className="w-3 h-3 text-accent shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 ml-3.5">
                <span className={`text-[10px] font-medium capitalize ${statusLabel[node.status]}`}>{node.status}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{node.role}</span>
              </div>
              {node.status !== "offline" && (
                <div className="flex items-center gap-3 ml-3.5 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5 text-muted-foreground" />
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          node.cpu > 80 ? "bg-destructive" : node.cpu > 60 ? "bg-warning" : "bg-success"
                        }`}
                        style={{ width: `${node.cpu}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground w-6 text-right">{Math.round(node.cpu)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MemoryStick className="w-2.5 h-2.5 text-muted-foreground" />
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${node.ram}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground w-6 text-right">{Math.round(node.ram)}%</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border text-[10px] text-muted-foreground">
        {nodes.length} node{nodes.length !== 1 ? "s" : ""} shown
      </div>
    </motion.div>
  );
}
