import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X } from "lucide-react";

type Role = "SuperAdmin" | "OrgAdmin" | "BackupOperator" | "RestoreOperator" | "ReadOnly";

interface Permission {
  label: string;
  category: string;
}

const permissions: Permission[] = [
  { label: "View Dashboard", category: "General" },
  { label: "Manage Users", category: "Users" },
  { label: "Assign Roles", category: "Users" },
  { label: "Create Backups", category: "Backups" },
  { label: "Delete Backups", category: "Backups" },
  { label: "Verify Integrity", category: "Backups" },
  { label: "Start Restore", category: "Restore" },
  { label: "Approve Restore", category: "Restore" },
  { label: "View Network", category: "Infrastructure" },
  { label: "Manage Nodes", category: "Infrastructure" },
  { label: "Configure Alerts", category: "Monitoring" },
  { label: "View Audit Log", category: "Audit" },
  { label: "Export Reports", category: "Audit" },
  { label: "System Settings", category: "Settings" },
];

const matrix: Record<string, Record<Role, boolean>> = {
  "View Dashboard": { SuperAdmin: true, OrgAdmin: true, BackupOperator: true, RestoreOperator: true, ReadOnly: true },
  "Manage Users": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "Assign Roles": { SuperAdmin: true, OrgAdmin: false, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "Create Backups": { SuperAdmin: true, OrgAdmin: true, BackupOperator: true, RestoreOperator: false, ReadOnly: false },
  "Delete Backups": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "Verify Integrity": { SuperAdmin: true, OrgAdmin: true, BackupOperator: true, RestoreOperator: true, ReadOnly: false },
  "Start Restore": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: true, ReadOnly: false },
  "Approve Restore": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "View Network": { SuperAdmin: true, OrgAdmin: true, BackupOperator: true, RestoreOperator: true, ReadOnly: true },
  "Manage Nodes": { SuperAdmin: true, OrgAdmin: false, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "Configure Alerts": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "View Audit Log": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "Export Reports": { SuperAdmin: true, OrgAdmin: true, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
  "System Settings": { SuperAdmin: true, OrgAdmin: false, BackupOperator: false, RestoreOperator: false, ReadOnly: false },
};

const roles: Role[] = ["SuperAdmin", "OrgAdmin", "BackupOperator", "RestoreOperator", "ReadOnly"];

const roleHeaderColors: Record<Role, string> = {
  SuperAdmin: "text-destructive",
  OrgAdmin: "text-primary",
  BackupOperator: "text-accent",
  RestoreOperator: "text-warning",
  ReadOnly: "text-muted-foreground",
};

export function RbacMatrixTab() {
  let lastCategory = "";

  return (
    <Card className="shadow-glass border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Role Permissions Matrix</CardTitle>
        <CardDescription>Overview of which capabilities each role has across the platform</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[200px]">Permission</th>
                {roles.map((r) => (
                  <th key={r} className={`text-center py-3 px-3 font-semibold text-xs ${roleHeaderColors[r]}`}>
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => {
                const showCategory = perm.category !== lastCategory;
                lastCategory = perm.category;
                return (
                  <>
                    {showCategory && (
                      <tr key={`cat-${perm.category}`}>
                        <td colSpan={roles.length + 1} className="pt-4 pb-1 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {perm.category}
                        </td>
                      </tr>
                    )}
                    <tr key={perm.label} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-4 text-foreground">{perm.label}</td>
                      {roles.map((role) => (
                        <td key={role} className="text-center py-2.5 px-3">
                          {matrix[perm.label][role] ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/10">
                              <Check className="w-3.5 h-3.5 text-success" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                              <X className="w-3 h-3 text-muted-foreground/50" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
