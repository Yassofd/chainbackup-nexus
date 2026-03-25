import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Lock, Key, FileText, AlertTriangle, CheckCircle,
  Clock, Globe, Users, RefreshCw,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] } },
};

const certificates = [
  { name: "TLS Root CA", status: "valid", expiry: "2027-06-15", issuer: "ChainBackup Internal CA" },
  { name: "Node Communication", status: "valid", expiry: "2026-12-01", issuer: "ChainBackup Internal CA" },
  { name: "API Gateway", status: "expiring", expiry: "2026-04-22", issuer: "Let's Encrypt" },
  { name: "Backup Encryption", status: "valid", expiry: "2027-03-10", issuer: "ChainBackup Internal CA" },
];

const auditEvents = [
  { time: "2 min ago", user: "admin@chainbackup.io", action: "Modified cluster settings", severity: "info" as const },
  { time: "15 min ago", user: "ops@chainbackup.io", action: "Rotated API key (prod-key-03)", severity: "warning" as const },
  { time: "1 hour ago", user: "admin@chainbackup.io", action: "Added user: dev@chainbackup.io", severity: "info" as const },
  { time: "3 hours ago", user: "system", action: "Failed login attempt from 192.168.1.45", severity: "critical" as const },
  { time: "6 hours ago", user: "ops@chainbackup.io", action: "Enabled 2FA for all admin accounts", severity: "info" as const },
  { time: "12 hours ago", user: "system", action: "Certificate renewal triggered for API Gateway", severity: "warning" as const },
];

const policies = [
  { name: "Encryption at Rest", status: true, desc: "AES-256-GCM for all stored backups" },
  { name: "Encryption in Transit", status: true, desc: "TLS 1.3 for all node communication" },
  { name: "RBAC Enforcement", status: true, desc: "Role-based access control active" },
  { name: "Audit Logging", status: true, desc: "All actions logged with 90-day retention" },
  { name: "IP Allowlisting", status: false, desc: "Restrict access to specific IPs" },
  { name: "SOC 2 Compliance", status: true, desc: "Compliant with SOC 2 Type II" },
];

export default function SecurityPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useKeyboardShortcuts(() => setCommandOpen(true));

  const securityScore = 92;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onOpenCommand={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
            {/* Header */}
            <motion.div variants={fadeUp}>
              <h1 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Security Overview
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Certificates, policies, and audit trail</p>
            </motion.div>

            {/* Security Score + Quick Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="glass-surface shadow-glass-md rounded-xl p-5 card-interactive">
                <div className="flex items-center justify-between mb-3">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <span className="text-xs text-success font-medium">Good</span>
                </div>
                <div className="text-3xl font-bold tabular-nums text-foreground">{securityScore}%</div>
                <div className="text-xs text-muted-foreground mt-1">Security Score</div>
              </div>
              {[
                { label: "Active Certificates", value: "4", icon: Lock, color: "text-primary" },
                { label: "API Keys", value: "3", icon: Key, color: "text-accent" },
                { label: "Active Sessions", value: "7", icon: Users, color: "text-success" },
              ].map((s) => (
                <div key={s.label} className="glass-surface shadow-glass-md rounded-xl p-5 card-interactive">
                  <div className="mb-3"><s.icon className={cn("w-5 h-5", s.color)} /></div>
                  <div className="text-2xl font-semibold tabular-nums text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Certificates */}
              <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Certificates
                  </h3>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Renew All
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {certificates.map((cert) => (
                    <div key={cert.name} className="px-5 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-foreground">{cert.name}</div>
                        <div className="text-[11px] text-muted-foreground">{cert.issuer} · Expires {cert.expiry}</div>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full",
                        cert.status === "valid" && "bg-success/10 text-success",
                        cert.status === "expiring" && "bg-warning/10 text-warning",
                      )}>
                        {cert.status === "valid" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {cert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Security Policies */}
              <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Security Policies
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {policies.map((p) => (
                    <div key={p.name} className="px-5 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-foreground">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.desc}</div>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                        p.status ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        {p.status ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {p.status ? "Active" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Audit Log */}
            <motion.div variants={fadeUp} className="glass-surface shadow-glass-md rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Recent Audit Events
                </h3>
                <span className="text-xs text-muted-foreground tabular-nums">{auditEvents.length} events</span>
              </div>
              <div className="divide-y divide-border">
                {auditEvents.map((ev, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-primary/5 transition-colors">
                    <span className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      ev.severity === "info" && "bg-primary",
                      ev.severity === "warning" && "bg-warning",
                      ev.severity === "critical" && "bg-destructive",
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground">{ev.action}</div>
                      <div className="text-[11px] text-muted-foreground">{ev.user}</div>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">{ev.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
