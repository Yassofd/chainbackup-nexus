import { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";
import { NetworkNode } from "@/data/networkNodes";

interface Props {
  nodes: NetworkNode[];
  selectedNodeId: string | null;
  onNodeClick: (node: NetworkNode) => void;
  onNodeHover: (node: NetworkNode | null, x: number, y: number) => void;
}

interface NodePosition {
  x: number; y: number; targetX: number; targetY: number;
}

export function NodesNetworkCanvas({ nodes, selectedNodeId, onNodeClick, onNodeHover }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const positionsRef = useRef<NodePosition[]>([]);
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0 });
  const timeRef = useRef(0);
  const { theme } = useTheme();
  const [size, setSize] = useState({ w: 800, h: 600 });

  const layoutNodes = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.34;
    return nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      const tx = cx + Math.cos(angle) * radius;
      const ty = cy + Math.sin(angle) * radius;
      const existing = positionsRef.current[i];
      return { x: existing?.x ?? tx, y: existing?.y ?? ty, targetX: tx, targetY: ty };
    });
  }, [nodes.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      setSize({ w: width, h: height });
      positionsRef.current = layoutNodes(width, height);
    });
    observer.observe(canvas.parentElement!);
    return () => observer.disconnect();
  }, [layoutNodes]);

  const hitTest = useCallback((mx: number, my: number): number => {
    const positions = positionsRef.current;
    const off = offsetRef.current;
    const scale = scaleRef.current;
    const nodeRadius = 28;
    for (let i = positions.length - 1; i >= 0; i--) {
      const p = positions[i];
      const sx = (p.x + off.x) * scale + size.w / 2 * (1 - scale);
      const sy = (p.y + off.y) * scale + size.h / 2 * (1 - scale);
      const dx = mx - sx;
      const dy = my - sy;
      if (dx * dx + dy * dy < nodeRadius * nodeRadius * scale * scale) return i;
    }
    return -1;
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const isDark = theme === "dark";

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = size.w;
      const h = size.h;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const off = offsetRef.current;
      const scale = scaleRef.current;
      ctx.save();
      ctx.translate(w / 2 * (1 - scale), h / 2 * (1 - scale));
      ctx.scale(scale, scale);
      ctx.translate(off.x, off.y);

      const positions = positionsRef.current;
      for (const p of positions) {
        p.x += (p.targetX - p.x) * 0.08;
        p.y += (p.targetY - p.y) * 0.08;
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].status === "offline") continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].status === "offline") continue;
          const a = positions[i];
          const b = positions[j];
          const dashOffset = t * 30;

          const isHighlighted = nodes[i].id === selectedNodeId || nodes[j].id === selectedNodeId;

          if (isDark) {
            ctx.strokeStyle = isHighlighted
              ? `rgba(139, 128, 255, ${0.35 + Math.sin(t * 2 + i + j) * 0.1})`
              : `rgba(99, 128, 255, ${0.12 + Math.sin(t * 2 + i + j) * 0.04})`;
            ctx.shadowColor = isHighlighted ? "rgba(139, 128, 255, 0.5)" : "rgba(99, 128, 255, 0.2)";
            ctx.shadowBlur = isHighlighted ? 8 : 3;
          } else {
            ctx.strokeStyle = isHighlighted
              ? `rgba(79, 80, 200, ${0.25 + Math.sin(t * 2 + i + j) * 0.05})`
              : `rgba(99, 128, 200, ${0.1 + Math.sin(t * 2 + i + j) * 0.03})`;
            ctx.shadowBlur = 0;
          }

          ctx.lineWidth = isHighlighted ? 1.5 : 1;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = -dashOffset;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;

          // Data packets
          const packetT = ((t * 0.5 + i * 0.3 + j * 0.7) % 1);
          const px = a.x + (b.x - a.x) * packetT;
          const py = a.y + (b.y - a.y) * packetT;
          ctx.beginPath();
          ctx.arc(px, py, isHighlighted ? 3 : 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "rgba(139, 160, 255, 0.6)" : "rgba(79, 100, 200, 0.4)";
          ctx.fill();
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const p = positions[i];
        const isSelected = node.id === selectedNodeId;
        const isMaster = node.role === "master";
        const isOnline = node.status !== "offline";
        const isSyncing = node.status === "syncing";
        const nodeR = isMaster ? 32 : 26;

        // Master glow
        if (isMaster && isOnline) {
          const glowAlpha = 0.3 + Math.sin(t * 3) * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeR + 10, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${glowAlpha})` : `rgba(109, 72, 216, ${glowAlpha * 0.6})`;
          ctx.shadowColor = isDark ? "rgba(139, 92, 246, 0.5)" : "rgba(109, 72, 216, 0.3)";
          ctx.shadowBlur = isDark ? 20 : 10;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Syncing ring
        if (isSyncing) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeR + 6, t * 2, t * 2 + Math.PI * 1.5);
          ctx.strokeStyle = isDark ? "rgba(245, 158, 11, 0.6)" : "rgba(217, 119, 6, 0.5)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeR + 5, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? "rgba(99, 128, 255, 0.9)" : "rgba(79, 100, 200, 0.7)";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
          ctx.stroke();
        }

        // Node body
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        if (!isOnline) {
          ctx.fillStyle = isDark ? "rgba(40, 40, 50, 0.8)" : "rgba(220, 220, 225, 0.9)";
        } else if (isMaster) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, nodeR);
          grad.addColorStop(0, isDark ? "rgba(109, 82, 206, 0.9)" : "rgba(129, 102, 226, 0.85)");
          grad.addColorStop(1, isDark ? "rgba(79, 62, 176, 0.7)" : "rgba(99, 82, 196, 0.7)");
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = isDark ? "rgba(25, 30, 48, 0.85)" : "rgba(255, 255, 255, 0.9)";
        }
        if (isDark && isOnline) {
          ctx.shadowColor = isMaster ? "rgba(139, 92, 246, 0.4)" : "rgba(99, 128, 255, 0.2)";
          ctx.shadowBlur = 12;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        ctx.strokeStyle = !isOnline
          ? (isDark ? "rgba(239, 68, 68, 0.5)" : "rgba(220, 50, 50, 0.4)")
          : (isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)");
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Status dot
        const dotX = p.x + nodeR * 0.6;
        const dotY = p.y - nodeR * 0.6;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = !isOnline ? "#ef4444" : isSyncing ? "#f59e0b" : "#22c55e";
        ctx.fill();
        if (isOnline && !isSyncing) {
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + Math.sin(t * 4) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Icon
        ctx.font = `${isMaster ? 14 : 12}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isMaster
          ? "rgba(255, 255, 255, 0.95)"
          : (isDark ? "rgba(200, 210, 255, 0.9)" : "rgba(60, 60, 80, 0.8)");
        ctx.fillText(isMaster ? "♛" : "●", p.x, p.y - 2);

        // Label
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = isDark ? "rgba(200, 210, 230, 0.85)" : "rgba(40, 40, 60, 0.8)";
        ctx.fillText(node.label, p.x, p.y + nodeR + 14);

        // Mini CPU/RAM bars
        if (isOnline) {
          const barW = 24;
          const barH = 3;
          const barX = p.x - barW / 2;
          const barY = p.y + 10;
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = node.cpu > 80 ? "#ef4444" : node.cpu > 60 ? "#f59e0b" : "#22c55e";
          ctx.fillRect(barX, barY, barW * (node.cpu / 100), barH);
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
          ctx.fillRect(barX, barY + 5, barW, barH);
          ctx.fillStyle = "hsl(270, 70%, 60%)";
          ctx.fillRect(barX, barY + 5, barW * (node.ram / 100), barH);
        }
      }

      ctx.restore();
      ctx.restore();
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [theme, size, selectedNodeId, nodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (hit >= 0) { onNodeClick(nodes[hit]); }
    else { dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startOffX: offsetRef.current.x, startOffY: offsetRef.current.y }; }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if (dragRef.current.dragging) {
      const dx = (e.clientX - dragRef.current.startX) / scaleRef.current;
      const dy = (e.clientY - dragRef.current.startY) / scaleRef.current;
      offsetRef.current = { x: dragRef.current.startOffX + dx, y: dragRef.current.startOffY + dy };
      return;
    }
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (hit >= 0) { canvasRef.current!.style.cursor = "pointer"; onNodeHover(nodes[hit], e.clientX, e.clientY); }
    else { canvasRef.current!.style.cursor = "grab"; onNodeHover(null, 0, 0); }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    scaleRef.current = Math.max(0.3, Math.min(3, scaleRef.current * (e.deltaY > 0 ? 0.9 : 1.1)));
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => { dragRef.current.dragging = false; }}
      onMouseLeave={() => { dragRef.current.dragging = false; onNodeHover(null, 0, 0); }}
      onWheel={handleWheel}
    />
  );
}
