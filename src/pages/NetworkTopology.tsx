import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { NetworkCanvas } from "@/components/network/NetworkCanvas";
import { NodeTooltip } from "@/components/network/NodeTooltip";
import { NodeDetailsPanel } from "@/components/network/NodeDetailsPanel";
import { NetworkLegend } from "@/components/network/NetworkLegend";
import { NetworkNode } from "@/data/networkNodes";
import { Radio } from "lucide-react";

export default function NetworkTopology() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ node: NetworkNode; x: number; y: number } | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Canvas */}
          <div className="flex-1 relative">
            {/* Header bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="glass-surface shadow-glass rounded-lg px-4 py-2.5 flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Network Topology</span>
                <span className="text-xs text-muted-foreground ml-2">7 nodes · Full Mesh</span>
              </div>

              {/* Live indicator */}
              <div className="glass-surface shadow-glass rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success status-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10">
              <NetworkLegend />
            </div>

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 z-10 glass-surface shadow-glass rounded-lg px-3 py-2 text-[11px] text-muted-foreground">
              Scroll to zoom · Drag to pan · Click node for details
            </div>

            <NetworkCanvas
              onNodeClick={setSelectedNode}
              onNodeHover={(node, x, y) =>
                setHoveredNode(node ? { node, x, y } : null)
              }
              selectedNodeId={selectedNode?.id ?? null}
            />
          </div>

          {/* Details Panel */}
          <AnimatePresence>
            {selectedNode && (
              <NodeDetailsPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <NodeTooltip
          node={hoveredNode.node}
          x={hoveredNode.x}
          y={hoveredNode.y}
        />
      )}
    </div>
  );
}
