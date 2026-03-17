export function NetworkLegend() {
  return (
    <div className="glass-surface shadow-glass rounded-lg px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-success" />
        <span className="text-muted-foreground">Online</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
        <span className="text-muted-foreground">Offline</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center">
          <span className="text-[8px] text-accent">♛</span>
        </div>
        <span className="text-muted-foreground">Master Node</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0 border-t border-dashed border-primary/50" style={{ width: 16 }} />
        <span className="text-muted-foreground">Connection</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <span className="text-muted-foreground">Data Packet</span>
      </div>
    </div>
  );
}
