import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index.tsx";
import NetworkTopology from "./pages/NetworkTopology.tsx";
import BackupsPage from "./pages/BackupsPage.tsx";
import RestoreWizard from "./pages/RestoreWizard.tsx";
import MonitoringPage from "./pages/MonitoringPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import NodesPage from "./pages/NodesPage.tsx";
import ResourcesPage from "./pages/ResourcesPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import SecurityPage from "./pages/SecurityPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route path="/network" element={<NetworkTopology />} />
            <Route path="/backups" element={<BackupsPage />} />
            <Route path="/restore" element={<RestoreWizard />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
