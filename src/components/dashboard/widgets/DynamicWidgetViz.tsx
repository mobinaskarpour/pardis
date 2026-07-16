"use client";

import { motion } from "framer-motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import type { WorkflowDashboardWidget } from "@/types/workflow";

interface VizProps {
  widget: WorkflowDashboardWidget;
  live?: boolean;
  featured?: boolean;
}

export function LiveCounterViz({ widget, live, featured }: VizProps) {
  const n = widget.numericValue ?? 0;
  return (
    <div className="flex items-end justify-between gap-2">
      <motion.span
        key={n}
        initial={live ? { scale: 1.08, opacity: 0.7 } : false}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "font-bold tabular-nums text-text-primary leading-none tracking-tight",
          featured ? "text-[42px]" : "text-[32px]"
        )}
      >
        {toPersianDigits(widget.value)}
      </motion.span>
    </div>
  );
}

export function TinyTrendViz({ widget, featured }: VizProps) {
  return (
    <div>
      <p
        className={cn(
          "font-bold text-text-primary tabular-nums tracking-tight",
          featured ? "text-[36px]" : "text-[28px]"
        )}
      >
        {toPersianDigits(widget.value)}
      </p>
      {widget.trend && (
        <p className="mt-1 text-[11px] font-medium text-success">
          {toPersianDigits(widget.trend)}
        </p>
      )}
    </div>
  );
}

export function CircularHealthViz({ widget, featured }: VizProps) {
  const score = widget.healthScore ?? 80;
  const r = featured ? 28 : 22;
  const size = featured ? 64 : 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 90 ? "var(--success)" : score >= 70 ? "var(--primary)" : "var(--warning)";

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-subtle)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p
          className={cn(
            "font-bold text-text-primary tabular-nums",
            featured ? "text-[28px]" : "text-[22px]"
          )}
        >
          {toPersianDigits(widget.value)}
        </p>
        {widget.trend && (
          <p className="text-[11px] font-medium text-success">
            {toPersianDigits(widget.trend)}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProgressWaveViz({ widget }: VizProps) {
  const pct = widget.healthScore ?? 75;
  return (
    <div>
      <p className="text-[18px] font-bold text-text-primary mb-2">
        {toPersianDigits(widget.value)}
      </p>
      <div className="relative h-6 overflow-hidden rounded-full bg-bg-subtle">
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-primary/80 to-accent-cyan/60"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 16px)",
          }}
          animate={{ x: [0, 16] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}

export function MiniTimelineViz({ widget }: VizProps) {
  const events = widget.timeline ?? [];
  return (
    <div className="space-y-1.5">
      {events.slice(0, 3).map((ev, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="text-[10px] text-text-muted tabular-nums">{ev.time}</span>
          <span className="text-[10px] text-text-secondary truncate">{ev.label}</span>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-[16px] font-bold text-text-primary">{toPersianDigits(widget.value)}</p>
      )}
    </div>
  );
}

export function ExecutionPulseViz({ widget, live }: VizProps) {
  const n = widget.numericValue ?? 0;
  const urgent = n > 0;
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center">
        {urgent && live && (
          <span className="absolute inset-0 rounded-full bg-error/20 animate-ping" />
        )}
        <span
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-bold",
            urgent ? "bg-error/15 text-error" : "bg-success/15 text-success"
          )}
        >
          {toPersianDigits(widget.value)}
        </span>
      </div>
      {widget.trend && (
        <span className="text-[10px] text-text-muted">{toPersianDigits(widget.trend)}</span>
      )}
    </div>
  );
}

export function HeatmapViz({ widget }: VizProps) {
  const cells = widget.heatmap ?? [0.3, 0.5, 0.7, 0.9, 0.6, 0.4, 0.2, 0.5];
  return (
    <div>
      <p className="text-[16px] font-bold text-text-primary mb-2">
        {toPersianDigits(widget.value)}
      </p>
      <div className="flex gap-0.5">
        {cells.map((intensity, i) => (
          <div
            key={i}
            className="h-8 flex-1 rounded-[3px]"
            style={{
              background: `rgba(45, 90, 123, ${0.15 + intensity * 0.75})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function RelationshipViz({ widget }: VizProps) {
  const items = widget.related ?? [];
  const max = Math.max(...items.map((r) => r.value), 1);
  return (
    <div className="space-y-1.5">
      <p className="text-[16px] font-bold text-text-primary">{toPersianDigits(widget.value)}</p>
      {items.slice(0, 3).map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-16 truncate text-[9px] text-text-muted">{item.label}</span>
          <div className="flex-1 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DynamicWidgetViz({ widget, live, featured }: VizProps) {
  const type = widget.vizType ?? "live-counter";
  switch (type) {
    case "tiny-trend":
      return <TinyTrendViz widget={widget} featured={featured} />;
    case "circular-health":
      return <CircularHealthViz widget={widget} featured={featured} />;
    case "progress-wave":
      return <ProgressWaveViz widget={widget} />;
    case "mini-timeline":
      return <MiniTimelineViz widget={widget} />;
    case "execution-pulse":
      return <ExecutionPulseViz widget={widget} live={live} />;
    case "heatmap":
      return <HeatmapViz widget={widget} />;
    case "relationship":
      return <RelationshipViz widget={widget} />;
    default:
      return <LiveCounterViz widget={widget} live={live} featured={featured} />;
  }
}
