export interface NetworkNode {
  id: string;
  label: string;
  role: "master" | "slave";
  status: "online" | "offline";
  region: string;
  cpu: number;
  ram: number;
  latency: number;
  uptime: string;
  ip: string;
  connections: number;
  lastBackup: string;
  x: number;
  y: number;
}

export const networkNodes: NetworkNode[] = [
  { id: "node-1", label: "us-east-1-a", role: "master", status: "online", region: "US East", cpu: 72, ram: 68, latency: 1.2, uptime: "47d 12h", ip: "10.0.1.12", connections: 6, lastBackup: "2m ago", x: 0, y: 0 },
  { id: "node-2", label: "us-east-1-b", role: "slave", status: "online", region: "US East", cpu: 54, ram: 62, latency: 2.1, uptime: "32d 8h", ip: "10.0.1.14", connections: 6, lastBackup: "5m ago", x: 0, y: 0 },
  { id: "node-3", label: "us-west-2-a", role: "slave", status: "online", region: "US West", cpu: 48, ram: 55, latency: 18.4, uptime: "28d 4h", ip: "10.0.2.8", connections: 6, lastBackup: "8m ago", x: 0, y: 0 },
  { id: "node-4", label: "eu-west-2-a", role: "slave", status: "online", region: "EU West", cpu: 61, ram: 70, latency: 42.3, uptime: "41d 16h", ip: "10.0.3.22", connections: 6, lastBackup: "3m ago", x: 0, y: 0 },
  { id: "node-5", label: "eu-central-1", role: "slave", status: "online", region: "EU Central", cpu: 39, ram: 48, latency: 38.7, uptime: "35d 2h", ip: "10.0.4.5", connections: 6, lastBackup: "12m ago", x: 0, y: 0 },
  { id: "node-6", label: "ap-south-1", role: "slave", status: "offline", region: "AP South", cpu: 0, ram: 0, latency: 0, uptime: "0d 0h", ip: "10.0.5.18", connections: 0, lastBackup: "3h ago", x: 0, y: 0 },
  { id: "node-7", label: "ap-east-1", role: "slave", status: "online", region: "AP East", cpu: 44, ram: 52, latency: 68.2, uptime: "22d 14h", ip: "10.0.6.11", connections: 6, lastBackup: "6m ago", x: 0, y: 0 },
];
