import { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";
import { NetworkNode, networkNodes } from "@/data/networkNodes";

interface Props {
  onNodeClick: (node: NetworkNode) => void;
  onNodeHover: (node: NetworkNode | null, x: number, y: number) => void;
  selectedNodeId: string | null;
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

export function NetworkCanvas({ onNodeClick, onNodeHover, selectedNodeId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const positionsRef = useRef<NodePosition[]>([]);
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; startOffX: number; startOffY: number }>({
    dragging: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0,
  });
  const timeRef = useRef(0);
  const { theme } = useTheme();
  const [size, setSize] = useState({ w: 800, h: 600 });

  // Layout nodes in a circle
  const layoutNodes = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.32;
    return networkNodes.map((_, i) => {
      const angle = (i / networkNodes.length) * Math.PI * 2 - Math.PI / 2;
      const tx = cx + Math.cos(angle) * radius;
      const ty = cy + Math.sin(angle) * radius;
      const existing = positionsRef.current[i];
      return {
        x: existing?.x ?? tx,
        y: existing?.y ?? ty,
        vx: 0,
        vy: 0,
        targetX: tx,
        targetY: ty,
      };
    });
  }, []);

  // Resize
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

  // Hit test
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

  // Draw loop
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

      const off = offsetRef.current;
      const scale = scaleRef.current;
      ctx.save();
      ctx.translate(w / 2 * (1 - scale), h / 2 * (1 - scale));
      ctx.scale(scale, scale);
      ctx.translate(off.x, off.y);

      const positions = positionsRef.current;

      // Animate positions toward targets
      for (const p of positions) {
        p.x += (p.targetX - p.x) * 0.08;
        p.y += (p.targetY - p.y) * 0.08;
      }

      // Draw connections (full mesh for online nodes)
      for (let i = 0; i < networkNodes.length; i++) {
        if (networkNodes[i].status === "offline") continue;
        for (let j = i + 1; j < networkNodes.length; j++) {
          if (networkNodes[j].status === "offline") continue;
          const a = positions[i];
          const b = positions[j];

          // Animated dash offset
          const dashOffset = t * 30;

          if (isDark) {
            ctx.strokeStyle = `rgba(99, 128, 255, ${0.15 + Math.sin(t * 2 + i + j) * 0.05})`;
            ctx.shadowColor = "rgba(99, 128, 255, 0.3)";
            ctx.shadowBlur = 4;
          } else {
            ctx.strokeStyle = `rgba(99, 128, 200, ${0.12 + Math.sin(t * 2 + i + j) * 0.03})`;
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
          }

          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = -dashOffset;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;

          // Data packet animation
          const packetT = ((t * 0.5 + i * 0.3 + j * 0.7) % 1);
          const px = a.x + (b.x - a.x) * packetT;
          const py = a.y + (b.y - a.y) * packetT;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "rgba(139, 160, 255, 0.6)" : "rgba(79, 100, 200, 0.4)";
          ctx.fill();
        }
      }

      // Draw nodes
      for (let i = 0; i < networkNodes.length; i++) {
        const node = networkNodes[i];
        const p = positions[i];
        const isSelected = node.id === selectedNodeId;
        const isMaster = node.role === "master";
        const isOnline = node.status === "online";
        const nodeR = isMaster ? 32 : 26;

        // Glow ring for master
        if (isMaster && isOnline) {
          const glowAlpha = 0.3 + Math.sin(t * 3) * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeR + 8, 0, Math.PI * 2);
          if (isDark) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${glowAlpha})`;
            ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
            ctx.shadowBlur = 16;
          } else {
            ctx.strokeStyle = `rgba(109, 72, 216, ${glowAlpha * 0.7})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(109, 72, 216, 0.3)";
          }
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeR + 5, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? "rgba(99, 128, 255, 0.8)" : "rgba(79, 100, 200, 0.6)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node body
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        if (!isOnline) {
          ctx.fillStyle = isDark ? "rgba(40, 40, 50, 0.8)" : "rgba(220, 220, 225, 0.9)";
        } else if (isMaster) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, nodeR);
          if (isDark) {
            grad.addColorStop(0, "rgba(109, 82, 206, 0.9)");
            grad.addColorStop(1, "rgba(79, 62, 176, 0.7)");
          } else {
            grad.addColorStop(0, "rgba(129, 102, 226, 0.85)");
            grad.addColorStop(1, "rgba(99, 82, 196, 0.7)");
          }
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
        if (!isOnline) {
          ctx.strokeStyle = isDark ? "rgba(239, 68, 68, 0.5)" : "rgba(220, 50, 50, 0.4)";
        } else {
          ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
        }
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Status dot
        const dotX = p.x + nodeR * 0.6;
        const dotY = p.y - nodeR * 0.6;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = isOnline ? "#22c55e" : "#ef4444";
        ctx.fill();
        if (isOnline) {
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + Math.sin(t * 4) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Role icon (crown for master, circle for slave)
        ctx.font = `${isMaster ? 14 : 12}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isMaster
          ? (isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.95)")
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

          // CPU
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = node.cpu > 80 ? "#ef4444" : node.cpu > 60 ? "#f59e0b" : "#22c55e";
          ctx.fillRect(barX, barY, barW * (node.cpu / 100), barH);

          // RAM
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
  }, [theme, size, selectedNodeId]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = hitTest(mx, my);
    if (hit >= 0) {
      onNodeClick(networkNodes[hit]);
    } else {
      dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startOffX: offsetRef.current.x, startOffY: offsetRef.current.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragRef.current.dragging) {
      const dx = (e.clientX - dragRef.current.startX) / scaleRef.current;
      const dy = (e.clientY - dragRef.current.startY) / scaleRef.current;
      offsetRef.current = { x: dragRef.current.startOffX + dx, y: dragRef.current.startOffY + dy };
      return;
    }

    const hit = hitTest(mx, my);
    if (hit >= 0) {
      canvasRef.current!.style.cursor = "pointer";
      onNodeHover(networkNodes[hit], e.clientX, e.clientY);
    } else {
      canvasRef.current!.style.cursor = "grab";
      onNodeHover(null, 0, 0);
    }
  };

  const handleMouseUp = () => {
    dragRef.current.dragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scaleRef.current = Math.max(0.3, Math.min(3, scaleRef.current * delta));
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { dragRef.current.dragging = false; onNodeHover(null, 0, 0); }}
      onWheel={handleWheel}
    />
  );
}
