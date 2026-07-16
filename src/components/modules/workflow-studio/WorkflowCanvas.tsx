"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StudioNode } from "./StudioNode";
import { ConnectionLayer } from "./ConnectionLayer";
import { MiniMap } from "./MiniMap";
import { computeFitViewport } from "@/lib/workflow-studio-utils";
import { cn } from "@/lib/utils";
import type { CanvasNode, StudioViewport } from "@/types/workflow-studio";

interface WorkflowCanvasProps {
  nodes: CanvasNode[];
  edges: import("@/types/workflow-studio").CanvasEdge[];
  viewport: StudioViewport;
  selectedId: string | null;
  isRunning: boolean;
  onSelect: (id: string | null) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onCommitMove: () => void;
  onViewportChange: (v: StudioViewport) => void;
  onAddNodeFromDrop: (defId: string, x: number, y: number) => void;
}

export function WorkflowCanvas({
  nodes,
  edges,
  viewport,
  selectedId,
  isRunning,
  onSelect,
  onMoveNode,
  onCommitMove,
  onViewportChange,
  onAddNodeFromDrop,
}: WorkflowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const fittedForNodes = useRef<string>("");

  const nodesKey = nodes.map((n) => n.id).join(",");

  const applyViewport = useCallback(
    (next: StudioViewport) => {
      onViewportChange(next);
    },
    [onViewportChange]
  );

  const handleFitView = useCallback(() => {
    if (!containerRef.current || nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 50) return;
    applyViewport(computeFitViewport(nodes, rect.width, rect.height));
    fittedForNodes.current = nodesKey;
  }, [nodes, nodesKey, applyViewport]);

  useEffect(() => {
    fittedForNodes.current = "";
  }, [nodesKey]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || nodes.length === 0) return;

    const fit = () => {
      if (fittedForNodes.current === nodesKey) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 50 || rect.height < 50) return;
      applyViewport(computeFitViewport(nodes, rect.width, rect.height));
      fittedForNodes.current = nodesKey;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [nodes, nodesKey, applyViewport]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceHeld(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY > 0 ? -0.06 : 0.06;
        const zoom = Math.min(1.5, Math.max(0.25, viewport.zoom + delta));
        applyViewport({ ...viewport, zoom });
      } else {
        applyViewport({
          ...viewport,
          x: viewport.x - e.deltaX,
          y: viewport.y - e.deltaY,
        });
      }
    },
    [viewport, applyViewport]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const isCanvas =
      target.dataset.canvas === "surface" ||
      target.dataset.canvas === "bg" ||
      target.tagName === "svg";

    if (!isCanvas && !spaceHeld && e.button !== 1) return;

    onSelect(null);
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      vx: viewport.x,
      vy: viewport.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    applyViewport({
      ...viewport,
      x: panStart.current.vx + (e.clientX - panStart.current.x),
      y: panStart.current.vy + (e.clientY - panStart.current.y),
    });
  };

  const handlePointerUp = () => setIsPanning(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const defId = e.dataTransfer.getData("node-def");
    if (!defId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;
    onAddNodeFromDrop(defId, x - 124, y - 56);
  };

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className="relative flex-1 min-w-0 min-h-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #f8f9fb 0%, #eceef2 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        data-canvas="bg"
        style={{
          backgroundImage: "radial-gradient(circle, #11131810 1px, transparent 1px)",
          backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      />

      <div
        className={cn(
          "absolute inset-0 overflow-hidden",
          isPanning || spaceHeld ? "cursor-grabbing" : "cursor-default"
        )}
        data-canvas="surface"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          className="absolute top-0 left-0 will-change-transform"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {nodes.map((node) => (
            <StudioNode
              key={node.id}
              node={node}
              zoom={viewport.zoom}
              selected={selectedId === node.id}
              onSelect={() => onSelect(node.id)}
              onDrag={(x, y) => onMoveNode(node.id, x, y)}
              onDragEnd={onCommitMove}
            />
          ))}
          <ConnectionLayer
            key={nodesKey}
            nodes={nodes}
            edges={edges}
            isRunning={isRunning}
            zoom={viewport.zoom}
          />
        </div>
      </div>

      {/* Canvas hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="rounded-full bg-white/80 backdrop-blur-sm border border-border/60 px-3 py-1 text-[10px] text-text-muted shadow-sm">
          Space + Drag برای جابجایی · Scroll برای zoom
        </span>
      </div>

      <MiniMap nodes={nodes} onFitView={handleFitView} />
    </div>
  );
}
