import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Shield, Database, RotateCcw, UserCog, Settings } from "lucide-react";

type Severity = "info" | "warning" | "critical";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  category: string;
  severity: Severity;
  ip: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Auth: <Shield className="w-3.5 h-3.5" />,
  Backup: <Database className="w-3.5 h-3.5" />,
  Restore: <RotateCcw className="w-3.5 h-3.5" />,
  Users: <UserCog className="w-3.5 h-3.5" />,
  System: <Settings className="w-3.5 h-3.5" />,
};

const severityClasses: Record<Severity, string> = {
  info: "bg-primary/10 text-primary ring-1 ring-primary/20",
  warning: "bg-warning/10 text-warning ring-1 ring-warning/20",
  critical: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
};

const entries: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2025-03-19 14:32:01", user: "Alex Morgan", action: "Login successful", target: "Dashboard", category: "Auth", severity: "info", ip: "192.168.1.12" },
  { id: "AUD-002", timestamp: "2025-03-19 14:28:45", user: "Jordan Lee", action: "Created backup", target: "BKP-0042", category: "Backup", severity: "info", ip: "10.0.2.15" },
  { id: "AUD-003", timestamp: "2025-03-19 14:15:22", user: "Alex Morgan", action: "Changed role", target: "Taylor Kim → RestoreOperator", category: "Users", severity: "warning", ip: "192.168.1.12" },
  { id: "AUD-004", timestamp: "2025-03-19 13:58:10", user: "Casey Rivera", action: "Deleted backup", target: "BKP-0039", category: "Backup", severity: "critical", ip: "10.0.2.22" },
  { id: "AUD-005", timestamp: "2025-03-19 13:45:00", user: "System", action: "Restore completed", target: "RST-0018", category: "Restore", severity: "info", ip: "—" },
  { id: "AUD-006", timestamp: "2025-03-19 13:30:55", user: "Drew Patel", action: "Failed login attempt", target: "—", category: "Auth", severity: "critical", ip: "203.0.113.5" },
  { id: "AUD-007", timestamp: "2025-03-19 12:50:30", user: "Alex Morgan", action: "Disabled user", target: "Taylor Kim", category: "Users", severity: "warning", ip: "192.168.1.12" },
  { id: "AUD-008", timestamp: "2025-03-19 12:20:11", user: "System", action: "Threshold alert triggered", target: "CPU > 90%", category: "System", severity: "critical", ip: "—" },
  { id: "AUD-009", timestamp: "2025-03-19 11:45:00", user: "Sam Nguyen", action: "Verified integrity", target: "BKP-0041", category: "Backup", severity: "info", ip: "10.0.3.8" },
  { id: "AUD-010", timestamp: "2025-03-19 11:10:33", user: "Morgan Chen", action: "Exported report", target: "Monthly backup summary", category: "System", severity: "info", ip: "192.168.1.50" },
];

export function AuditLogTab() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = entries.filter((e) => {
    const matchSearch = e.action.toLowerCase().includes(search.toLowerCase()) || e.user.toLowerCase().includes(search.toLowerCase()) || e.target.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || e.severity === severityFilter;
    const matchCategory = categoryFilter === "all" || e.category === categoryFilter;
    return matchSearch && matchSeverity && matchCategory;
  });

  return (
    <Card className="shadow-glass border-border">
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search audit log..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50" />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px] h-9 bg-muted/50"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px] h-9 bg-muted/50"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Auth">Auth</SelectItem>
              <SelectItem value="Backup">Backup</SelectItem>
              <SelectItem value="Restore">Restore</SelectItem>
              <SelectItem value="Users">Users</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>

        {/* Log entries */}
        <div className="divide-y divide-border/50">
          {filtered.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                {categoryIcons[entry.category] || <Settings className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{entry.action}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${severityClasses[entry.severity]}`}>
                    {entry.severity}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  by <span className="font-medium text-foreground/80">{entry.user}</span>
                  {entry.target !== "—" && <> → <span className="font-mono">{entry.target}</span></>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs tabular-nums text-muted-foreground">{entry.timestamp}</div>
                <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">{entry.ip}</div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No audit entries match your filters</div>
        )}
      </CardContent>
    </Card>
  );
}
