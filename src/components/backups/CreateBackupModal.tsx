import { useState } from "react";
import { motion } from "framer-motion";
import { X, HardDrive, Clock, Play, ChevronDown, Info } from "lucide-react";

const sourceOptions = [
  { value: "us-east-1-a", label: "us-east-1-a", region: "US East" },
  { value: "us-east-1-b", label: "us-east-1-b", region: "US East" },
  { value: "us-west-2-c", label: "us-west-2-c", region: "US West" },
  { value: "eu-west-2-b", label: "eu-west-2-b", region: "EU West" },
  { value: "eu-central-1", label: "eu-central-1", region: "EU Central" },
  { value: "ap-south-1", label: "ap-south-1", region: "AP South" },
  { value: "ap-east-1", label: "ap-east-1", region: "AP East" },
];

const typeOptions = [
  { value: "full", label: "Full Backup", desc: "Complete snapshot of all data" },
  { value: "incremental", label: "Incremental", desc: "Only changes since last backup" },
  { value: "differential", label: "Differential", desc: "Changes since last full backup" },
];

const schedulePresets = [
  { value: "now", label: "Run Now", cron: "" },
  { value: "hourly", label: "Every Hour", cron: "0 * * * *" },
  { value: "daily", label: "Daily at Midnight", cron: "0 0 * * *" },
  { value: "weekly", label: "Weekly (Sun)", cron: "0 0 * * 0" },
  { value: "custom", label: "Custom Cron", cron: "" },
];

interface Props {
  onClose: () => void;
}

export function CreateBackupModal({ onClose }: Props) {
  const [source, setSource] = useState("");
  const [type, setType] = useState("full");
  const [schedule, setSchedule] = useState("now");
  const [customCron, setCustomCron] = useState("0 */6 * * *");
  const [retention, setRetention] = useState("30");
  const [compress, setCompress] = useState(true);
  const [encrypt, setEncrypt] = useState(true);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[520px] max-h-[85vh] glass-surface shadow-glass-md rounded-xl border border-border flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Create Backup</h2>
              <p className="text-[11px] text-muted-foreground">Configure and schedule a new backup job</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          {/* Source */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Source Node</label>
            <div className="relative">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full h-10 pl-3 pr-8 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none appearance-none text-foreground"
              >
                <option value="">Select a node…</option>
                {sourceOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label} ({s.region})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Backup Type</label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`rounded-lg p-3 text-left ring-1 transition-all duration-150 ${
                    type === t.value
                      ? "ring-primary bg-primary/10"
                      : "ring-border bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div className={`text-xs font-medium ${type === t.value ? "text-primary" : "text-foreground"}`}>
                    {t.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Schedule
            </label>
            <div className="flex flex-wrap gap-2">
              {schedulePresets.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSchedule(s.value)}
                  className={`h-8 px-3 rounded-md text-xs font-medium ring-1 transition-all duration-150 ${
                    schedule === s.value
                      ? "ring-primary bg-primary/10 text-primary"
                      : "ring-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {schedule === "custom" && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  placeholder="* * * * *"
                  className="flex-1 h-9 px-3 text-sm font-mono bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none text-foreground"
                />
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Info className="w-3 h-3" /> min hr day mon dow
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Options</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 bg-muted/30 rounded-lg p-3">
                <input type="checkbox" checked={compress} onChange={() => setCompress(!compress)}
                  className="w-3.5 h-3.5 rounded accent-primary" />
                <div>
                  <div className="text-xs text-foreground">Compression</div>
                  <div className="text-[10px] text-muted-foreground">Gzip level 6</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-muted/30 rounded-lg p-3">
                <input type="checkbox" checked={encrypt} onChange={() => setEncrypt(!encrypt)}
                  className="w-3.5 h-3.5 rounded accent-primary" />
                <div>
                  <div className="text-xs text-foreground">Encryption</div>
                  <div className="text-[10px] text-muted-foreground">AES-256-GCM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Retention */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Retention Period</label>
            <div className="relative w-32">
              <select value={retention} onChange={(e) => setRetention(e.target.value)}
                className="w-full h-9 pl-3 pr-8 text-sm bg-muted/50 rounded-lg ring-1 ring-border focus:ring-2 focus:ring-primary/50 outline-none appearance-none text-foreground">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button onClick={onClose} className="h-9 px-4 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={!source}
          >
            <Play className="w-3.5 h-3.5" />
            {schedule === "now" ? "Start Backup" : "Schedule Backup"}
          </button>
        </div>
      </motion.div>
    </>
  );
}
