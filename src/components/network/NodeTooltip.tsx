import { NetworkNode } from "@/data/networkNodes";

interface Props {
  node: NetworkNode;
  x: number;
  y: number;
}

export function NodeTooltip({ node, x, y }: Props) {
  return (
    <div
      className="fixed z-50 pointer-events-none glass-surface shadow-glass-md rounded-lg border border-border px-4 py-3 min-w-[200px]"
      style={{ left: x + 16, top: y - 10 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${node.status === "online" ? "bg-success" : "bg-destructive"}`} />
        <span className="text-sm font-semibold text-foreground">{node.label}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
          node.role === "master"
            ? "bg-accent/15 text-accent"
            : "bg-muted text-muted-foreground"
        }`}>
          {node.role}
        </span>
      </div>
      {node.status === "online" ? (
        <div className="space-y-1.5">
          <MetricRow label="CPU" value={`${node.cpu}%`} percent={node.cpu} color={node.cpu > 80 ? "bg-destructive" : node.cpu > 60 ? "bg-warning" : "bg-success"} />
          <MetricRow label="RAM" value={`${node.ram}%`} percent={node.ram} color="bg-accent" />
          <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
            <span>Latency: <span className="tabular-nums text-foreground">{node.latency}ms</span></span>
            <span>Uptime: <span className="text-foreground">{node.uptime}</span></span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-destructive">Node unreachable</div>
      )}
    </div>
  );
}

function MetricRow({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-7">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-[11px] tabular-nums text-foreground w-8 text-right">{value}</span>
    </div>
  );
}
