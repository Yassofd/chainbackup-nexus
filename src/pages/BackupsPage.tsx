import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Database, Plus, Search, Filter, Trash2, ShieldCheck, MoreHorizontal,
  ChevronDown, Calendar as CalendarIcon, X, CheckCircle, XCircle, Clock,
  Loader2, HardDrive, ArrowUpDown, Download,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CreateBackupModal } from "@/components/backups/CreateBackupModal";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type BackupType = "full" | "incremental" | "differential";
type BackupStatus = "completed" | "active" | "failed" | "syncing" | "pending";

interface Backup {
  id: string;
  source: string;
  type: BackupType;
  status: BackupStatus;
  size: string;
  sizeBytes: number;
  date: Date;
  duration: string;
  progress?: number;
  verified: boolean;
}

const backupsData: Backup[] = [
  { id: "BKP-2847", source: "us-east-1-a", type: "full", status: "completed", size: "24.8 GB", sizeBytes: 24800, date: new Date(2026, 2, 17, 14, 32), duration: "4m 12s", verified: true },
  { id: "BKP-2846", source: "eu-west-2-b", type: "incremental", status: "completed", size: "3.2 GB", sizeBytes: 3200, date: new Date(2026, 2, 17, 14, 18), duration: "1m 08s", verified: true },
  { id: "BKP-2845", source: "ap-south-1", type: "full", status: "failed", size: "—", sizeBytes: 0, date: new Date(2026, 2, 17, 13, 44), duration: "1m 44s", verified: false },
  { id: "BKP-2844", source: "us-west-2-c", type: "differential", status: "syncing", size: "18.1 GB", sizeBytes: 18100, date: new Date(2026, 2, 17, 13, 22), duration: "—", progress: 67, verified: false },
  { id: "BKP-2843", source: "eu-central-1", type: "incremental", status: "completed", size: "1.8 GB", sizeBytes: 1800, date: new Date(2026, 2, 17, 12, 55), duration: "0m 42s", verified: true },
  { id: "BKP-2842", source: "us-east-1-b", type: "full", status: "active", size: "12.4 GB", sizeBytes: 12400, date: new Date(2026, 2, 17, 12, 30), duration: "—", progress: 34, verified: false },
  { id: "BKP-2841", source: "ap-east-1", type: "full", status: "completed", size: "31.5 GB", sizeBytes: 31500, date: new Date(2026, 2, 17, 11, 15), duration: "5m 22s", verified: false },
  { id: "BKP-2840", source: "us-east-1-a", type: "incremental", status: "completed", size: "2.1 GB", sizeBytes: 2100, date: new Date(2026, 2, 17, 10, 48), duration: "0m 38s", verified: true },
  { id: "BKP-2839", source: "eu-west-2-b", type: "differential", status: "completed", size: "8.4 GB", sizeBytes: 8400, date: new Date(2026, 2, 17, 9, 22), duration: "2m 14s", verified: true },
  { id: "BKP-2838", source: "us-west-2-c", type: "full", status: "pending", size: "—", sizeBytes: 0, date: new Date(2026, 2, 17, 9, 0), duration: "—", verified: false },
  { id: "BKP-2837", source: "eu-central-1", type: "full", status: "completed", size: "22.7 GB", sizeBytes: 22700, date: new Date(2026, 2, 16, 23, 15), duration: "4m 02s", verified: true },
  { id: "BKP-2836", source: "ap-south-1", type: "incremental", status: "completed", size: "4.3 GB", sizeBytes: 4300, date: new Date(2026, 2, 16, 22, 40), duration: "1m 18s", verified: false },
];

const sources = ["All Sources", "us-east-1-a", "us-east-1-b", "us-west-2-c", "eu-west-2-b", "eu-central-1", "ap-south-1", "ap-east-1"];
const statuses: ("all" | BackupStatus)[] = ["all", "completed", "active", "syncing", "failed", "pending"];
const typeLabels: Record<BackupType, { label: string; class: string }> = {
  full: { label: "Full", class: "bg-primary/10 text-primary ring-1 ring-primary/20" },
  incremental: { label: "Incr", class: "bg-success/10 text-success ring-1 ring-success/20" },
  differential: { label: "Diff", class: "bg-accent/10 text-accent ring-1 ring-accent/20" },
};

export default function BackupsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BackupStatus>("all");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<"date" | "size">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...backupsData];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => b.id.toLowerCase().includes(q) || b.source.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    if (sourceFilter !== "All Sources") list = list.filter((b) => b.source === sourceFilter);
    if (dateFrom) list = list.filter((b) => b.date >= dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59);
      list = list.filter((b) => b.date <= end);
    }
    list.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * (a.date.getTime() - b.date.getTime());
      return mul * (a.sizeBytes - b.sizeBytes);
    });
    return list;
  }, [searchQuery, statusFilter, sourceFilter, dateFrom, dateTo, sortField, sortDir]);

  const toggleSort = (field: "date" | "size") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((b) => b.id)));
  };

  const clearFilters = () => {
    setSearchQuery(""); setStatusFilter("all"); setSourceFilter("All Sources");
    setDateFrom(undefined); setDateTo(undefined);
  };

  const hasFilters = searchQuery || statusFilter !== "all" || sourceFilter !== "All Sources" || dateFrom || dateTo;

  const stats = {
    total: backupsData.length,
    completed: backupsData.filter((b) => b.status === "completed").length,
    running: backupsData.filter((b) => b.status === "active" || b.status === "syncing").length,
    failed: backupsData.filter((b) => b.status === "failed").length,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6 space-y-5">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">Backup Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage, monitor, and verify distributed backups</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-glass"
            >
              <Plus className="w-4 h-4" />
              Create Backup
            </button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Backups", value: stats.total, icon: Database, color: "text-primary" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-success" },
              { label: "Running", value: stats.running, icon: Loader2, color: "text-primary" },
              { label: "Failed", value: stats.failed, icon: XCircle, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="glass-surface shadow-glass rounded-lg px-4 py-3 flex items-center gap-3">
                <s.icon className={`w-4 h-4 ${s.color} shrink-0`} />
                <div>
                  <div className="text-lg font-semibold tabular-nums text-foreground">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-surface shadow-glass-md rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or source…"
                  className="w-full h-9 pl-9 pr-3 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="h-9 pl-3 pr-8 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none appearance-none text-foreground"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Source Filter */}
              <div className="relative">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none appearance-none text-foreground"
                >
                  {sources.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Date From */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "h-9 px-3 text-sm rounded-lg ring-1 ring-border flex items-center gap-2 transition-colors",
                    dateFrom ? "bg-primary/10 text-primary ring-primary/30" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}>
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {dateFrom ? format(dateFrom, "MMM d") : "From"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              {/* Date To */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "h-9 px-3 text-sm rounded-lg ring-1 ring-border flex items-center gap-2 transition-colors",
                    dateTo ? "bg-primary/10 text-primary ring-primary/30" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}>
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {dateTo ? format(dateTo, "MMM d") : "To"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              {hasFilters && (
                <button onClick={clearFilters} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Bulk actions */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="flex items-center gap-3 pt-3 mt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
                    <button className="h-7 px-2.5 text-xs rounded-md bg-destructive/10 text-destructive ring-1 ring-destructive/20 flex items-center gap-1.5 hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    <button className="h-7 px-2.5 text-xs rounded-md bg-success/10 text-success ring-1 ring-success/20 flex items-center gap-1.5 hover:bg-success/20 transition-colors">
                      <ShieldCheck className="w-3 h-3" /> Verify
                    </button>
                    <button className="h-7 px-2.5 text-xs rounded-md bg-muted text-foreground ring-1 ring-border flex items-center gap-1.5 hover:bg-muted/80 transition-colors">
                      <Download className="w-3 h-3" /> Export
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 w-10">
                      <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 rounded border-border accent-primary" />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Source</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("size")}>
                      <span className="flex items-center gap-1">Size <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("date")}>
                      <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Progress</th>
                    <th className="py-3 px-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((backup, i) => (
                    <motion.tr
                      key={backup.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-primary/5 transition-colors duration-150",
                        selectedIds.has(backup.id) && "bg-primary/5"
                      )}
                    >
                      <td className="py-3 px-4">
                        <input type="checkbox" checked={selectedIds.has(backup.id)} onChange={() => toggleSelect(backup.id)}
                          className="w-3.5 h-3.5 rounded border-border accent-primary" />
                      </td>
                      <td className="py-3 px-4 font-mono text-xs tabular-nums text-foreground">{backup.id}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{backup.source}</td>
                      <td className="py-3 px-4">
                        <span className={cn("inline-flex px-2 py-0.5 rounded text-[11px] font-medium", typeLabels[backup.type].class)}>
                          {typeLabels[backup.type].label}
                        </span>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={backup.status} /></td>
                      <td className="py-3 px-4 text-xs tabular-nums text-muted-foreground">{backup.size}</td>
                      <td className="py-3 px-4 text-xs tabular-nums text-muted-foreground">{format(backup.date, "MMM d, HH:mm")}</td>
                      <td className="py-3 px-4 text-xs tabular-nums text-muted-foreground">{backup.duration}</td>
                      <td className="py-3 px-4">
                        {backup.progress !== undefined ? (
                          <div className="flex items-center gap-2 w-24">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div className="progress-bar-inner" initial={{ width: 0 }} animate={{ width: `${backup.progress}%` }}
                                transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }} />
                            </div>
                            <span className="text-[11px] tabular-nums text-muted-foreground w-7 text-right">{backup.progress}%</span>
                          </div>
                        ) : backup.verified ? (
                          <span className="flex items-center gap-1 text-[11px] text-success"><ShieldCheck className="w-3 h-3" /> Verified</span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === backup.id ? null : backup.id)}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {actionMenuId === backup.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-4 top-10 z-20 w-40 glass-surface shadow-glass-md rounded-lg border border-border py-1"
                            >
                              <button className="w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
                                <ShieldCheck className="w-3.5 h-3.5 text-success" /> Verify Integrity
                              </button>
                              <button className="w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
                                <Download className="w-3.5 h-3.5 text-primary" /> Download
                              </button>
                              <button className="w-full px-3 py-2 text-xs text-left hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <Filter className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <div className="text-sm text-muted-foreground">No backups match your filters</div>
                <button onClick={clearFilters} className="text-xs text-primary mt-1 hover:underline">Clear all filters</button>
              </div>
            )}
            {/* Footer */}
            <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>{filtered.length} of {backupsData.length} backups</span>
              <span className="tabular-nums">Total: {(backupsData.reduce((a, b) => a + b.sizeBytes, 0) / 1000).toFixed(1)} TB</span>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && <CreateBackupModal onClose={() => setShowCreateModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
