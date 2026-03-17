import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

const jobs = [
  { id: "JOB-421", type: "Full Backup", node: "us-east-1-a", progress: 87, speed: "245 MB/s", eta: "2m 14s", status: "syncing" as const },
  { id: "JOB-420", type: "Incremental", node: "eu-west-2-b", progress: 43, speed: "182 MB/s", eta: "8m 32s", status: "active" as const },
  { id: "JOB-419", type: "Verification", node: "ap-south-1", progress: 65, speed: "312 MB/s", eta: "4m 08s", status: "active" as const },
  { id: "JOB-418", type: "Migration", node: "us-west-2-c", progress: 12, speed: "98 MB/s", eta: "18m 45s", status: "active" as const },
  { id: "JOB-417", type: "Snapshot", node: "eu-central-1", progress: 95, speed: "420 MB/s", eta: "0m 32s", status: "syncing" as const },
];

export function OngoingJobs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Play className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Ongoing Jobs</h2>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{jobs.length} running</span>
      </div>
      <div className="divide-y divide-border">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="px-5 py-3 hover:bg-primary/5 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                <span className="text-xs font-mono tabular-nums text-foreground">{job.id}</span>
                <span className="text-xs text-muted-foreground">· {job.type}</span>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="progress-bar-inner"
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{job.progress}%</span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted-foreground">
              <span>{job.node}</span>
              <span className="tabular-nums">{job.speed}</span>
              <span className="tabular-nums">ETA: {job.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
