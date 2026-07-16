"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUp, Sparkles } from "lucide-react";
import { spring } from "@/lib/motion";
import { analyticsDetailHref } from "@/lib/analytics-metrics";
import type { DashboardWidgetInstance } from "@/hooks/useLiveDashboard";
import { DynamicWidgetViz } from "./DynamicWidgetViz";
import { cn } from "@/lib/utils";
import { getCategoryLabel } from "@/config/workflow-categories";
import { toPersianDigits } from "@/lib/persian";

function CardSparkline({
  id,
  points,
  positive = true,
}: {
  id: string;
  points: number[];
  positive?: boolean;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 320;
  const h = 56;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 6 - ((p - min) / range) * (h - 12);
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive ? "var(--primary)" : "var(--error)";
  const fillCoords = `0,${h} ${coords} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-x-0 bottom-0 h-16 w-full opacity-60 transition-opacity duration-300 group-hover:opacity-90"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillCoords} fill={`url(#${id})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

interface DynamicWidgetCardProps {
  widget: DashboardWidgetInstance;
  index: number;
  live?: boolean;
  featured?: boolean;
}

export function DynamicWidgetCard({
  widget,
  index,
  live,
  featured,
}: DynamicWidgetCardProps) {
  const href = analyticsDetailHref(widget.workflowId, widget.id);
  const sparkline = widget.sparkline ?? [12, 14, 13, 16, 15, 18, 17];
  const showSparkline =
    widget.vizType === "live-counter" ||
    widget.vizType === "tiny-trend" ||
    !widget.vizType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.05, ...spring.soft }}
      className={cn(featured && "sm:col-span-2 xl:col-span-2")}
    >
      <Link
        href={href}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-[18px]",
          "border border-border/60 bg-bg-elevated",
          "shadow-[var(--shadow-sm)]",
          "transition-all duration-300",
          "hover:border-primary/20 hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5",
          featured ? "h-[248px] p-6 sm:flex-row sm:items-stretch sm:gap-6" : "h-[248px] p-5"
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />

        {live && (
          <span className="absolute top-4 end-4 flex h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(77,138,92,0.5)]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
          </span>
        )}

        <div className={cn("relative z-10 flex flex-col min-w-0", featured ? "flex-1" : "h-full")}>
          <div className="flex items-start justify-between gap-2 pe-4">
            <span className="inline-flex items-center rounded-[7px] bg-bg-subtle/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              {getCategoryLabel(widget.workflowCategory)}
            </span>
          </div>

          <h3
            className={cn(
              "mt-2 font-semibold leading-snug text-text-primary line-clamp-2",
              featured ? "text-[17px]" : "text-[15px]"
            )}
          >
            {widget.label}
          </h3>

          <div className={cn("mt-3 flex-1 min-h-0", featured && "mt-4")}>
            <DynamicWidgetViz widget={widget} live={live} featured={featured} />
          </div>

          <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-3">
            <p className="text-[10px] font-medium text-text-muted truncate">
              {widget.workflowName}
            </p>
            {widget.trend && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-[6px] bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success">
                <ArrowUp size={9} strokeWidth={2.5} />
                {toPersianDigits(widget.trend)}
              </span>
            )}
          </div>
        </div>

        {featured && (
          <div className="hidden sm:flex flex-col justify-between shrink-0 w-[140px] rounded-[14px] border border-border/50 bg-bg-layer-1/80 p-4">
            <div>
              <p className="text-[10px] font-medium text-text-muted">فرآیند</p>
              <p className="mt-1 text-[13px] font-semibold text-text-primary leading-snug line-clamp-2">
                {widget.workflowName}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              تحلیل
              <ArrowLeft size={12} />
            </span>
          </div>
        )}

        {showSparkline && (
          <CardSparkline
            id={`spark-${widget.workflowId}-${widget.id}`}
            points={sparkline}
            positive={!widget.trend?.startsWith("-")}
          />
        )}
      </Link>
    </motion.div>
  );
}

interface WorkflowWidgetGroupProps {
  workflowName: string;
  workflowId: string;
  source: "ai" | "manual";
  status: string;
  lastRun: string;
  widgets: DashboardWidgetInstance[];
  live?: boolean;
  startIndex?: number;
}

export function WorkflowWidgetGroup({
  workflowName,
  workflowId,
  source,
  status,
  lastRun,
  widgets,
  live,
  startIndex = 0,
}: WorkflowWidgetGroupProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/workflows/${workflowId}`}
            className="text-[14px] font-semibold text-text-primary hover:text-primary transition-colors"
          >
            {workflowName}
          </Link>
          {source === "ai" && (
            <span className="inline-flex items-center gap-1 rounded-[6px] bg-accent-indigo/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent-indigo">
              <Sparkles size={10} />
              AI
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              status === "active"
                ? "bg-success/10 text-success"
                : status === "warning"
                  ? "bg-warning/10 text-warning"
                  : "bg-bg-subtle text-text-muted"
            )}
          >
            {status === "active" ? "فعال" : status === "warning" ? "هشدار" : status}
          </span>
        </div>
        <span className="text-[11px] text-text-muted">آخرین اجرا: {lastRun}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {widgets.map((widget, i) => (
          <DynamicWidgetCard
            key={`${widget.workflowId}-${widget.id}`}
            widget={widget}
            index={startIndex + i}
            live={live}
          />
        ))}
      </div>
    </section>
  );
}
