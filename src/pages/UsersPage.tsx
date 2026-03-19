import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserListTab } from "@/components/users/UserListTab";
import { RbacMatrixTab } from "@/components/users/RbacMatrixTab";
import { AuditLogTab } from "@/components/users/AuditLogTab";
import { Users, Shield, ScrollText } from "lucide-react";

export default function UsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Users & Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage users, roles, and review audit trails</p>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="users" className="gap-1.5">
                <Users className="w-3.5 h-3.5" /> Users
              </TabsTrigger>
              <TabsTrigger value="rbac" className="gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Permissions
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-1.5">
                <ScrollText className="w-3.5 h-3.5" /> Audit Log
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="users" asChild>
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <UserListTab />
                </motion.div>
              </TabsContent>
              <TabsContent value="rbac" asChild>
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <RbacMatrixTab />
                </motion.div>
              </TabsContent>
              <TabsContent value="audit" asChild>
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <AuditLogTab />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
