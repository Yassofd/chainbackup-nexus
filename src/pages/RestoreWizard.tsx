import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Database, ArrowRight, ArrowLeft, Check, RotateCcw, Server,
  Clock, Layers, Target, ShieldCheck, AlertTriangle, FileText,
  Download, ChevronRight, Loader2, CheckCircle, XCircle, HardDrive,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface BackupOption {
  id: string;
  source: string;
  date: Date;
  size: string;
  type: "full" | "incremental" | "differential";
  status: "completed" | "verified";
}

type RestoreType = "full" | "granular" | "point-in-time";

interface Destination {
  id: string;
  name: string;
  region: string;
  available: boolean;
}

type LogLevel = "info" | "warn" | "error" | "success";

interface LogEntry {
  time: string;
  level: LogLevel;
  message: string;
}

/* ─── Mock data ─── */
const backups: BackupOption[] = [
  { id: "BKP-2847", source: "us-east-1-a", date: new Date(2026, 2, 17, 14, 32), size: "24.8 GB", type: "full", status: "verified" },
  { id: "BKP-2846", source: "eu-west-2-b", date: new Date(2026, 2, 17, 14, 18), size: "3.2 GB", type: "incremental", status: "completed" },
  { id: "BKP-2843", source: "eu-central-1", date: new Date(2026, 2, 17, 12, 55), size: "1.8 GB", type: "incremental", status: "verified" },
  { id: "BKP-2841", source: "ap-east-1", date: new Date(2026, 2, 17, 11, 15), size: "31.5 GB", type: "full", status: "completed" },
  { id: "BKP-2840", source: "us-east-1-a", date: new Date(2026, 2, 17, 10, 48), size: "2.1 GB", type: "incremental", status: "verified" },
  { id: "BKP-2839", source: "eu-west-2-b", date: new Date(2026, 2, 17, 9, 22), size: "8.4 GB", type: "differential", status: "verified" },
  { id: "BKP-2837", source: "eu-central-1", date: new Date(2026, 2, 16, 23, 15), size: "22.7 GB", type: "full", status: "verified" },
];

const destinations: Destination[] = [
  { id: "dest-1", name: "us-east-1-a (Primary)", region: "US East", available: true },
  { id: "dest-2", name: "eu-west-2-b (Replica)", region: "EU West", available: true },
  { id: "dest-3", name: "ap-south-1 (DR)", region: "AP South", available: true },
  { id: "dest-4", name: "us-west-2-c (Standby)", region: "US West", available: false },
];

const restoreTypes: { key: RestoreType; label: string; desc: string; icon: typeof Layers }[] = [
  { key: "full", label: "Full Restore", desc: "Restore the entire backup to a target node. Replaces all existing data.", icon: Database },
  { key: "granular", label: "Granular Restore", desc: "Select specific files, tables, or objects to restore from the snapshot.", icon: Layers },
  { key: "point-in-time", label: "Point-in-Time", desc: "Restore to a specific timestamp using WAL logs and incremental chains.", icon: Clock },
];

const stepLabels = ["Select Backup", "Restore Type", "Destination", "Confirm"];

const logMessages: { level: LogLevel; message: string }[] = [
  { level: "info", message: "Initiating restore operation…" },
  { level: "info", message: "Connecting to source node…" },
  { level: "success", message: "Source node authenticated." },
  { level: "info", message: "Downloading snapshot metadata…" },
  { level: "info", message: "Verifying checksum integrity…" },
  { level: "success", message: "Checksum verified — SHA-256 match." },
  { level: "info", message: "Preparing destination volume…" },
  { level: "warn", message: "Destination has 3 stale locks — clearing." },
  { level: "info", message: "Streaming data blocks… (0%)" },
  { level: "info", message: "Streaming data blocks… (25%)" },
  { level: "info", message: "Streaming data blocks… (50%)" },
  { level: "info", message: "Streaming data blocks… (75%)" },
  { level: "info", message: "Streaming data blocks… (100%)" },
  { level: "info", message: "Applying WAL replay…" },
  { level: "info", message: "Running post-restore validations…" },
  { level: "success", message: "Restore completed successfully." },
];

/* ─── Component ─── */
export default function RestoreWizard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [restoreType, setRestoreType] = useState<RestoreType | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [pointInTime, setPointInTime] = useState("");

  // restore progress state
  const [restoring, setRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [restoreComplete, setRestoreComplete] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const canNext =
    (step === 0 && selectedBackup) ||
    (step === 1 && restoreType) ||
    (step === 2 && destination) ||
    step === 3;

  const next = () => { if (canNext && step < 3) setStep(step + 1); };
  const prev = () => { if (step > 0 && !restoring) setStep(step - 1); };

  const startRestore = () => {
    setRestoring(true);
    setProgress(0);
    setLogs([]);
    setRestoreComplete(false);
  };

  // simulate restore
  useEffect(() => {
    if (!restoring || restoreComplete) return;
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= logMessages.length) {
        clearInterval(timer);
        setRestoreComplete(true);
        return;
      }
      const msg = logMessages[idx];
      const now = new Date();
      setLogs((prev) => [...prev, { time: format(now, "HH:mm:ss"), level: msg.level, message: msg.message }]);
      setProgress(Math.min(100, Math.round(((idx + 1) / logMessages.length) * 100)));
      idx++;
    }, 600);
    return () => clearInterval(timer);
  }, [restoring, restoreComplete]);

  // auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const backupObj = backups.find((b) => b.id === selectedBackup);
  const destObj = destinations.find((d) => d.id === destination);

  /* ─── Step Renderers ─── */
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">Choose a backup snapshot to restore from.</p>
            {backups.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBackup(b.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg ring-1 transition-all duration-150 flex items-center gap-4",
                  selectedBackup === b.id
                    ? "ring-primary bg-primary/5"
                    : "ring-border hover:ring-primary/40 hover:bg-muted/50"
                )}
              >
                <Database className={cn("w-5 h-5 shrink-0", selectedBackup === b.id ? "text-primary" : "text-muted-foreground")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-medium text-foreground">{b.id}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      b.type === "full" ? "bg-primary/10 text-primary" : b.type === "incremental" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                    )}>{b.type}</span>
                    {b.status === "verified" && <ShieldCheck className="w-3.5 h-3.5 text-success" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{b.source} · {b.size} · {format(b.date, "MMM d, HH:mm")}</div>
                </div>
                {selectedBackup === b.id && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">How would you like to restore this backup?</p>
            {restoreTypes.map((rt) => (
              <button
                key={rt.key}
                onClick={() => setRestoreType(rt.key)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-xl ring-1 transition-all duration-150 flex items-start gap-4",
                  restoreType === rt.key
                    ? "ring-primary bg-primary/5 shadow-sm"
                    : "ring-border hover:ring-primary/40 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  restoreType === rt.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <rt.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{rt.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rt.desc}</div>
                </div>
                {restoreType === rt.key && <Check className="w-4 h-4 text-primary shrink-0 mt-1" />}
              </button>
            ))}
            {restoreType === "point-in-time" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <label className="block text-xs font-medium text-foreground mt-3 mb-1.5">Restore to timestamp</label>
                <input
                  type="datetime-local"
                  value={pointInTime}
                  onChange={(e) => setPointInTime(e.target.value)}
                  className="h-9 px-3 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none text-foreground w-full max-w-xs"
                />
              </motion.div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">Select a destination node for the restored data.</p>
            {destinations.map((d) => (
              <button
                key={d.id}
                onClick={() => d.available && setDestination(d.id)}
                disabled={!d.available}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg ring-1 transition-all duration-150 flex items-center gap-4",
                  !d.available && "opacity-40 cursor-not-allowed",
                  destination === d.id
                    ? "ring-primary bg-primary/5"
                    : d.available ? "ring-border hover:ring-primary/40 hover:bg-muted/50" : "ring-border"
                )}
              >
                <Server className={cn("w-5 h-5 shrink-0", destination === d.id ? "text-primary" : "text-muted-foreground")} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.region} {!d.available && "· Unavailable"}</div>
                </div>
                {d.available ? (
                  destination === d.id ? <Check className="w-4 h-4 text-primary shrink-0" /> : <div className="w-3 h-3 rounded-full bg-success/60 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
            ))}
          </div>
        );

      case 3:
        if (restoring) return renderRestoreProgress();
        return (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">Review the details below and confirm your restore operation.</p>
            <div className="glass-surface rounded-xl ring-1 ring-border divide-y divide-border">
              {[
                { label: "Backup", value: `${backupObj?.id} — ${backupObj?.source}`, sub: `${backupObj?.size} · ${backupObj ? format(backupObj.date, "MMM d, HH:mm") : ""}` },
                { label: "Restore Type", value: restoreTypes.find((r) => r.key === restoreType)?.label ?? "", sub: restoreType === "point-in-time" && pointInTime ? `Target: ${pointInTime}` : undefined },
                { label: "Destination", value: destObj?.name ?? "", sub: destObj?.region },
              ].map((row) => (
                <div key={row.label} className="px-5 py-3 flex items-start justify-between gap-4">
                  <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{row.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{row.value}</div>
                    {row.sub && <div className="text-xs text-muted-foreground">{row.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 ring-1 ring-warning/20">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div className="text-xs text-foreground leading-relaxed">
                This operation will <strong>overwrite existing data</strong> on the destination node. Ensure you have a recent backup of the target before proceeding.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRestoreProgress = () => (
    <div className="space-y-5">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {restoreComplete ? "Restore Complete" : "Restoring…"}
          </span>
          <span className="text-sm tabular-nums font-medium text-primary">{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        {restoreComplete && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-3 text-success text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> All data restored successfully.
          </motion.div>
        )}
      </div>

      {/* Logs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Operation Logs</span>
          <span className="text-[10px] tabular-nums text-muted-foreground">{logs.length} entries</span>
        </div>
        <div className="h-52 overflow-y-auto bg-muted/30 rounded-lg ring-1 ring-border p-3 font-mono text-[11px] space-y-0.5">
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="text-muted-foreground shrink-0">{log.time}</span>
                <span className={cn(
                  "shrink-0 w-1.5 h-1.5 rounded-full mt-1.5",
                  log.level === "info" && "bg-primary",
                  log.level === "success" && "bg-success",
                  log.level === "warn" && "bg-warning",
                  log.level === "error" && "bg-destructive",
                )} />
                <span className={cn(
                  log.level === "success" && "text-success",
                  log.level === "warn" && "text-warning",
                  log.level === "error" && "text-destructive",
                  log.level === "info" && "text-foreground",
                )}>{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Download report */}
      {restoreComplete && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-glass"
        >
          <Download className="w-4 h-4" /> Download Report (PDF)
        </motion.button>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-primary" />
                Restore Wizard
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Guided recovery from distributed snapshots</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-1 flex-1">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex-1",
                    i < step && "bg-success/10 text-success",
                    i === step && "bg-primary/10 text-primary ring-1 ring-primary/20",
                    i > step && "bg-muted/50 text-muted-foreground",
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
                      i < step && "bg-success text-success-foreground",
                      i === step && "bg-primary text-primary-foreground",
                      i > step && "bg-muted text-muted-foreground",
                    )}>
                      {i < step ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className="hidden sm:inline whitespace-nowrap">{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-surface shadow-glass-md rounded-xl p-6"
            >
              {renderStepContent()}
            </motion.div>

            {/* Navigation */}
            {!restoring && (
              <div className="flex items-center justify-between">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className={cn(
                    "h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                    step === 0 ? "text-muted-foreground/40 cursor-not-allowed" : "text-foreground hover:bg-muted ring-1 ring-border"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {step < 3 ? (
                  <button
                    onClick={next}
                    disabled={!canNext}
                    className={cn(
                      "h-9 px-5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-glass",
                      canNext
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={startRestore}
                    className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-glass"
                  >
                    <RotateCcw className="w-4 h-4" /> Start Restore
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
