import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";

const jobs = [
  { id: "BKP-7842", node: "us-east-1-prod-a", progress: 87, speed: "245 MB/s", eta: "2m 14s", status: "syncing" as const },
  { id: "BKP-7841", node: "eu-west-2-prod-b", progress: 100, speed: "—", eta: "—", status: "completed" as const },
  { id: "BKP-7840", node: "ap-south-1-stg", progress: 43, speed: "182 MB/s", eta: "8m 32s", status: "active" as const },
  { id: "BKP-7839", node: "us-west-2-prod-c", progress: 0, speed: "—", eta: "—", status: "failed" as const },
  { id: "BKP-7838", node: "eu-central-1-prod", progress: 65, speed: "312 MB/s", eta: "4m 08s", status: "syncing" as const },
  { id: "BKP-7837", node: "us-east-1-dev", progress: 12, speed: "98 MB/s", eta: "18m 45s", status: "active" as const },
  { id: "BKP-7836", node: "ap-east-1-prod", progress: 0, speed: "—", eta: "Queued", status: "pending" as const },
  { id: "BKP-7835", node: "eu-north-1-prod", progress: 100, speed: "—", eta: "—", status: "completed" as const },
];

export function ActiveJobsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-surface shadow-glass-md rounded-xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Active Jobs</h2>
        <span className="text-xs text-muted-foreground tabular-nums">{jobs.length} jobs</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Job ID</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Node</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground w-48">Progress</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Speed</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">ETA</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-border last:border-0 hover:bg-primary/5 transition-colors duration-150"
              >
                <td className="py-3 px-5 font-mono text-xs tabular-nums text-foreground">{job.id}</td>
                <td className="py-3 px-5 text-xs text-muted-foreground">{job.node}</td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="progress-bar-inner"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
                      {job.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-5 text-xs tabular-nums text-muted-foreground">{job.speed}</td>
                <td className="py-3 px-5 text-xs tabular-nums text-muted-foreground">{job.eta}</td>
                <td className="py-3 px-5">
                  <StatusBadge status={job.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
