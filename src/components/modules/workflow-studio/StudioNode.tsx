"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { getNodeDef } from "@/config/workflow-nodes";
import { NODE_W, NODE_H } from "@/lib/workflow-studio-utils";
import type { CanvasNode, NodeRunStatus } from "@/types/workflow-studio";
import {
  Brain, Bell, BellRing, Building2, Calculator, Calendar, CalendarPlus,
  Clock, Download, FileCheck, FileText, FileType, Gauge, GitBranch, GitMerge,
  Landmark, Layers, Lock, Magnet, Mail, MessageCircle, MessageSquare, Mic,
  Phone, Receipt, RefreshCw, Repeat, Scan, ScanText, Search, Send, Shield,
  ShieldCheck, Siren, Smartphone, Sparkles, Stethoscope, Tags, Timer,
  TrendingUp, Undo, User, UserCheck, UserPlus, Waves, Activity, Archive,
  Banknote, BarChart, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "user-plus": UserPlus, "user-check": UserCheck, magnet: Magnet, layers: Layers,
  waves: Waves, "file-check": FileCheck, stethoscope: Stethoscope,
  "shield-check": ShieldCheck, receipt: Receipt, "bell-ring": BellRing,
  siren: Siren, scan: Scan, download: Download, "refresh-cw": RefreshCw,
  "building-2": Building2, brain: Brain, tags: Tags, "scan-text": ScanText,
  "file-text": FileText, "message-square": MessageSquare, "git-branch": GitBranch,
  sparkles: Sparkles, "trending-up": TrendingUp, activity: Activity, mic: Mic,
  smartphone: Smartphone, "message-circle": MessageCircle, send: Send, mail: Mail,
  bell: Bell, phone: Phone, calendar: Calendar, "file-type": FileType,
  archive: Archive, timer: Timer, "git-merge": GitMerge, repeat: Repeat,
  calculator: Calculator, shield: Shield, banknote: Banknote, undo: Undo,
  landmark: Landmark, search: Search, user: User, clock: Clock,
  "calendar-plus": CalendarPlus, "bar-chart": BarChart, gauge: Gauge, lock: Lock,
};

const statusStyles: Record<NodeRunStatus, { border: string; glow: string }> = {
  idle: { border: "border-white/60", glow: "" },
  running: {
    border: "border-accent-cyan/60",
    glow: "shadow-[0_0_0_1px_rgba(90,171,191,0.3),0_8px_32px_rgba(90,171,191,0.2)]",
  },
  success: {
    border: "border-success/40",
    glow: "shadow-[0_0_0_1px_rgba(77,138,92,0.25),0_8px_24px_rgba(77,138,92,0.15)]",
  },
  warning: { border: "border-warning/40", glow: "" },
  error: {
    border: "border-error/40",
    glow: "shadow-[0_0_0_1px_rgba(184,107,107,0.25),0_8px_24px_rgba(184,107,107,0.15)]",
  },
};

interface StudioNodeProps {
  node: CanvasNode;
  selected: boolean;
  zoom: number;
  onSelect: () => void;
  onDrag: (x: number, y: number) => void;
  onDragEnd: () => void;
}

export function StudioNode({
  node,
  selected,
  zoom,
  onSelect,
  onDrag,
  onDragEnd,
}: StudioNodeProps) {
  const def = getNodeDef(node.defId);
  const dragState = useRef<{
    startX: number;
    startY: number;
    nodeX: number;
    nodeY: number;
  } | null>(null);

  if (!def) return null;

  const Icon = iconMap[def.icon] ?? Sparkles;
  const st = statusStyles[node.status];

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const dx = (e.clientX - dragState.current.startX) / zoom;
    const dy = (e.clientY - dragState.current.startY) / zoom;
    onDrag(
      Math.round(dragState.current.nodeX + dx),
      Math.round(dragState.current.nodeY + dy)
    );
  };

  const handlePointerUp = () => {
    if (dragState.current) {
      dragState.current = null;
      onDragEnd();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
        zIndex: selected ? 20 : 10,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className="cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <div
        className={cn(
          "relative h-full rounded-[20px] border overflow-hidden",
          "bg-white/95 backdrop-blur-xl transition-all duration-[200ms]",
          st.border,
          st.glow,
          selected
            ? "ring-2 ring-primary/25 shadow-[0_12px_40px_rgba(45,90,123,0.15)]"
            : "shadow-[0_4px_20px_rgba(17,19,24,0.08)] hover:shadow-[0_8px_32px_rgba(17,19,24,0.12)]"
        )}
      >
        <div
          className="absolute top-0 inset-x-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${def.color}, ${def.color}66)` }}
        />

        <div className="flex h-full items-center gap-3 px-4 pt-1">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
            style={{
              background: `linear-gradient(135deg, ${def.color}20, ${def.color}08)`,
              boxShadow: `inset 0 0 0 1px ${def.color}20`,
            }}
          >
            <Icon size={20} strokeWidth={1.6} style={{ color: def.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-text-primary truncate">
              {def.title}
            </p>
            <p className="text-[11px] text-text-tertiary truncate mt-0.5">
              {def.description}
            </p>
            {node.executionTime && (
              <p className="text-[10px] text-text-muted mt-1 tabular-nums">
                {node.executionTime}
              </p>
            )}
          </div>
        </div>

        {node.status === "running" && (
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-bg-subtle overflow-hidden">
            <div className="h-full w-1/2 bg-accent-cyan animate-[shimmer_1s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Output port — left (RTL flow) */}
        {def.outputs > 0 && (
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-accent-indigo shadow-[0_0_0_1px_rgba(91,95,199,0.4)]"
            data-port="output"
          />
        )}
        {/* Input port — right */}
        {def.inputs > 0 && (
          <div
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-primary shadow-[0_0_0_1px_rgba(45,90,123,0.4)]"
            data-port="input"
          />
        )}
      </div>
    </div>
  );
}
