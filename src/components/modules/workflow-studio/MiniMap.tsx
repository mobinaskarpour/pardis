"use client";

import { Maximize2 } from "lucide-react";
import { NODE_W, NODE_H } from "@/lib/workflow-studio-utils";
import type { CanvasNode } from "@/types/workflow-studio";

interface MiniMapProps {
  nodes: CanvasNode[];
  onFitView?: () => void;
}

export function MiniMap({ nodes, onFitView }: MiniMapProps) {
  if (nodes.length === 0) return null;

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs) - 20;
  const minY = Math.min(...ys) - 20;
  const maxX = Math.max(...xs) + NODE_W + 20;
  const maxY = Math.max(...ys) + NODE_H + 20;
  const w = maxX - minX;
  const h = maxY - minY;
  const scale = Math.min(140 / w, 90 / h);

  return (
    <div className="absolute top-3 left-3 rounded-[14px] border border-border/60 bg-white/90 backdrop-blur-md p-2.5 shadow-[0_4px_20px_rgba(17,19,24,0.08)]">
      <div className="flex items-center justify-between mb-2 gap-2">
        <p className="text-[9px] font-medium text-text-muted">نقشه</p>
        {onFitView && (
          <button
            type="button"
            onClick={onFitView}
            title="نمایش کل"
            className="flex h-5 w-5 items-center justify-center rounded-md text-text-muted hover:bg-bg-subtle hover:text-text-primary transition-colors cursor-pointer"
          >
            <Maximize2 size={10} />
          </button>
        )}
      </div>
      <svg width={140} height={90} className="rounded-[8px] bg-[#f4f5f7]">
        {nodes.map((n) => (
          <rect
            key={n.id}
            x={(n.x - minX) * scale}
            y={(n.y - minY) * scale}
            width={Math.max(NODE_W * scale, 8)}
            height={Math.max(16, NODE_H * scale * 0.35)}
            rx={3}
            fill="#2d5a7b"
            opacity={0.55}
          />
        ))}
      </svg>
    </div>
  );
}
