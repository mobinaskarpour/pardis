"use client";

import { useMemo } from "react";
import {
  bezierPath,
  getGraphBounds,
  getPortPosition,
} from "@/lib/workflow-studio-utils";
import type { CanvasEdge, CanvasNode } from "@/types/workflow-studio";

interface ConnectionLayerProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  isRunning: boolean;
  zoom: number;
}

function screenStroke(canvasZoom: number, px: number): number {
  return px / Math.max(canvasZoom, 0.25);
}

export function ConnectionLayer({
  nodes,
  edges,
  isRunning,
  zoom,
}: ConnectionLayerProps) {
  const nodeMap = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes]
  );
  const bounds = useMemo(() => getGraphBounds(nodes), [nodes]);
  const haloWidth = screenStroke(zoom, 7);
  const lineWidth = screenStroke(zoom, 3.5);

  return (
    <svg
      aria-hidden
      className="absolute top-0 left-0 pointer-events-none"
      width={bounds.width}
      height={bounds.height}
      style={{ zIndex: 15, overflow: "visible" }}
    >
      {edges.map((edge) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;

        const p1 = getPortPosition(from, edge.fromPort, "output");
        const p2 = getPortPosition(to, edge.toPort, "input");
        const d = bezierPath(p1.x, p1.y, p2.x, p2.y);

        return (
          <g key={edge.id}>
            <path
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={haloWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={d}
              fill="none"
              stroke="#2d5a7b"
              strokeWidth={lineWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {isRunning && (
              <>
                <path
                  d={d}
                  fill="none"
                  stroke="#4da8a8"
                  strokeWidth={screenStroke(zoom, 4)}
                  strokeLinecap="round"
                  opacity={0.45}
                  className="animate-pulse-soft"
                />
                <circle r={screenStroke(zoom, 4)} fill="#4da8a8" opacity={0.9}>
                  <animateMotion dur="1.4s" repeatCount="indefinite" path={d} />
                </circle>
                <circle r={screenStroke(zoom, 2.5)} fill="#2d5a7b" opacity={0.7}>
                  <animateMotion
                    dur="1.4s"
                    repeatCount="indefinite"
                    path={d}
                    begin="0.5s"
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
