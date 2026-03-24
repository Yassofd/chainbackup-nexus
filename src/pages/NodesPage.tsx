import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { NetworkNode, networkNodes } from "@/data/networkNodes";
import { NodesTopBar } from "@/components/nodes/NodesTopBar";
import { NodeListPanel } from "@/components/nodes/NodeListPanel";
import { NodesNetworkCanvas } from "@/components/nodes/NodesNetworkCanvas";
import { NodeDetailsDrawer } from "@/components/nodes/NodeDetailsDrawer";
import { NodeTooltip } from "@/components/network/NodeTooltip";

export default function NodesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ node: NetworkNode; x: number; y: number } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useKeyboardShortcuts(() => setCommandOpen(true));

  // Simulate live metric updates
  const [liveNodes, setLiveNodes] = useState(networkNodes);
  useEffect(() => {
    const id = setInterval(() => {
      setLiveNodes((prev) =>
        prev.map((n) =>
          n.status === "offline"
            ? n
            : {
                ...n,
                cpu: Math.max(5, Math.min(98, n.cpu + (Math.random() - 0.5) * 6)),
                ram: Math.max(10, Math.min(95, n.ram + (Math.random() - 0.5) * 4)),
                disk: Math.max(5, Math.min(95, n.disk + (Math.random() - 0.5) * 2)),
                latency: Math.max(0.5, n.latency + (Math.random() - 0.5) * 3),
              }
        )
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Keep selected node in sync with live data
  useEffect(() => {
    if (selectedNode) {
      const updated = liveNodes.find((n) => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
    }
  }, [liveNodes]);

  const filteredNodes = liveNodes.filter((n) => {
    if (filterStatus !== "all" && n.status !== filterStatus) return false;
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase()) && !n.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const masterNode = liveNodes.find((n) => n.role === "master");
  const onlineCount = liveNodes.filter((n) => n.status === "online").length;
  const syncingCount = liveNodes.filter((n) => n.status === "syncing").length;
  const offlineCount = liveNodes.filter((n) => n.status === "offline").length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenCommand={() => setCommandOpen(true)} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Metrics Bar */}
          <NodesTopBar
            total={liveNodes.length}
            online={onlineCount}
            syncing={syncingCount}
            offline={offlineCount}
            masterLabel={masterNode?.label ?? "—"}
          />

          {/* Three-column layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Node list */}
            <NodeListPanel
              nodes={filteredNodes}
              selectedNodeId={selectedNode?.id ?? null}
              onSelectNode={setSelectedNode}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Center: Network visualization */}
            <div className="flex-1 relative">
              <NodesNetworkCanvas
                nodes={liveNodes}
                selectedNodeId={selectedNode?.id ?? null}
                onNodeClick={setSelectedNode}
                onNodeHover={(node, x, y) => setHoveredNode(node ? { node, x, y } : null)}
              />
              {/* Live badge */}
              <div className="absolute top-4 right-4 z-10 glass-surface shadow-glass rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-xs text-muted-foreground font-medium">Live Topology</span>
              </div>
            </div>

            {/* Right: Details panel */}
            <AnimatePresence>
              {selectedNode && (
                <NodeDetailsDrawer
                  node={selectedNode}
                  onClose={() => setSelectedNode(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

      {hoveredNode && (
        <NodeTooltip node={hoveredNode.node} x={hoveredNode.x} y={hoveredNode.y} />
      )}
    </div>
  );
}
