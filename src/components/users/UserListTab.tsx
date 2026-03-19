import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, UserCog, Ban, Pencil, Shield } from "lucide-react";
import { toast } from "sonner";

type Role = "SuperAdmin" | "OrgAdmin" | "BackupOperator" | "RestoreOperator" | "ReadOnly";
type UserStatus = "active" | "disabled" | "pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
  status: UserStatus;
  lastLogin: string;
}

const roleColors: Record<Role, string> = {
  SuperAdmin: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  OrgAdmin: "bg-primary/10 text-primary ring-1 ring-primary/20",
  BackupOperator: "bg-accent/10 text-accent ring-1 ring-accent/20",
  RestoreOperator: "bg-warning/10 text-warning ring-1 ring-warning/20",
  ReadOnly: "bg-muted text-muted-foreground ring-1 ring-border",
};

const statusConfig: Record<UserStatus, { classes: string; label: string }> = {
  active: { classes: "bg-success/10 text-success ring-1 ring-success/20", label: "Active" },
  disabled: { classes: "bg-muted text-muted-foreground ring-1 ring-border", label: "Disabled" },
  pending: { classes: "bg-warning/10 text-warning ring-1 ring-warning/20", label: "Pending" },
};

const allRoles: Role[] = ["SuperAdmin", "OrgAdmin", "BackupOperator", "RestoreOperator", "ReadOnly"];

const initialUsers: User[] = [
  { id: "USR-001", name: "Alex Morgan", email: "alex@chainbackup.io", role: "SuperAdmin", organization: "ChainBackup Inc.", status: "active", lastLogin: "2 min ago" },
  { id: "USR-002", name: "Jordan Lee", email: "jordan@acme.co", role: "OrgAdmin", organization: "Acme Corp", status: "active", lastLogin: "1 hr ago" },
  { id: "USR-003", name: "Casey Rivera", email: "casey@acme.co", role: "BackupOperator", organization: "Acme Corp", status: "active", lastLogin: "3 hrs ago" },
  { id: "USR-004", name: "Taylor Kim", email: "taylor@globex.com", role: "RestoreOperator", organization: "Globex Ltd", status: "disabled", lastLogin: "5 days ago" },
  { id: "USR-005", name: "Morgan Chen", email: "morgan@chainbackup.io", role: "ReadOnly", organization: "ChainBackup Inc.", status: "active", lastLogin: "12 min ago" },
  { id: "USR-006", name: "Drew Patel", email: "drew@globex.com", role: "OrgAdmin", organization: "Globex Ltd", status: "pending", lastLogin: "Never" },
  { id: "USR-007", name: "Sam Nguyen", email: "sam@initech.io", role: "BackupOperator", organization: "Initech", status: "active", lastLogin: "30 min ago" },
  { id: "USR-008", name: "Jamie Torres", email: "jamie@initech.io", role: "ReadOnly", organization: "Initech", status: "active", lastLogin: "2 hrs ago" },
];

export function UserListTab() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Add user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("ReadOnly");
  const [newOrg, setNewOrg] = useState("");

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const user: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: newName,
      email: newEmail,
      role: newRole,
      organization: newOrg || "Unassigned",
      status: "pending",
      lastLogin: "Never",
    };
    setUsers((prev) => [user, ...prev]);
    setAddOpen(false);
    setNewName(""); setNewEmail(""); setNewRole("ReadOnly"); setNewOrg("");
    toast.success(`User ${newName} invited`);
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "disabled" ? "active" : "disabled" } : u
      )
    );
    const user = users.find((u) => u.id === id);
    toast.success(`${user?.name} ${user?.status === "disabled" ? "enabled" : "disabled"}`);
  };

  const handleRoleChange = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditUser(null);
    toast.success("Role updated");
  };

  return (
    <>
      <Card className="shadow-glass border-border">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px] h-9 bg-muted/50"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-muted/50"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add User
            </Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map((user) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border transition-colors hover:bg-muted/30 group"
                  >
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${roleColors[user.role]}`}>
                        <Shield className="w-3 h-3" /> {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.organization}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig[user.status].classes}`}>
                        {statusConfig[user.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">{user.lastLogin}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => setEditUser(user)} className="gap-2">
                            <Pencil className="w-3.5 h-3.5" /> Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id)} className="gap-2">
                            <Ban className="w-3.5 h-3.5" /> {user.status === "disabled" ? "Enable" : "Disable"} User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No users match your filters</div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="jane@company.com" type="email" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{allRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Organization</Label>
              <Input value={newOrg} onChange={(e) => setNewOrg(e.target.value)} placeholder="Acme Corp" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Role — {editUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {allRoles.map((role) => (
              <button
                key={role}
                onClick={() => editUser && handleRoleChange(editUser.id, role)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                  ${editUser?.role === role ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/30 hover:bg-muted/50"}`}
              >
                <UserCog className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground">{role}</div>
                  <div className="text-xs text-muted-foreground">
                    {role === "SuperAdmin" && "Full system access"}
                    {role === "OrgAdmin" && "Manage org users & settings"}
                    {role === "BackupOperator" && "Create and manage backups"}
                    {role === "RestoreOperator" && "Perform restore operations"}
                    {role === "ReadOnly" && "View-only access"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
