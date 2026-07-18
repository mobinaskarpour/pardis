"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { useDashboardStore } from "@/store/dashboard-store";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

const toneStyles = {
  default: "text-text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
  info: "text-primary",
} as const;

function Sparkline({
  id,
  points,
  tone = "default",
}: {
  id: string;
  points: number[];
  tone?: keyof typeof toneStyles;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 280;
  const h = 48;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 4 - ((p - min) / range) * (h - 8);
      return `${x},${y}`;
    })
    .join(" ");
  const fill = `0,${h} ${coords} ${w},${h}`;
  const color =
    tone === "success"
      ? "var(--success)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "danger"
          ? "var(--error)"
          : "var(--primary)";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-x-0 bottom-0 h-14 w-full opacity-70"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#${id})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

export function DiscoveredDashboardPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const dashboards = useDashboardStore((s) => s.dashboards);
  const dashboard = useMemo(
    () => dashboards.find((d) => d.id === id),
    [dashboards, id]
  );

  if (!dashboard) {
    return (
      <AppShell pageTitle="داشبورد">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <LayoutDashboard size={28} className="text-text-muted" />
          <p className="text-[15px] text-text-secondary">
            این داشبورد پیدا نشد.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
          >
            بازگشت به گفتگو
            <ArrowRight size={14} />
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle={dashboard.name}>
      <div className="px-6 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-[6px] bg-accent-indigo/10 px-2 py-0.5 text-[10px] font-semibold text-accent-indigo">
                <Sparkles size={10} strokeWidth={2} />
                AI Generated
              </span>
              <span className="text-[11px] text-text-muted">
                {dashboard.createdAt}
              </span>
            </div>
            <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-text-primary">
              {dashboard.name}
            </h1>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-text-tertiary">
              {dashboard.description}
            </p>
            <p className="mt-2 text-[12px] text-text-muted">
              سناریو: {dashboard.scenarioName} ·{" "}
              {toPersianDigits(dashboard.widgets.length)} ویجت
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-bg-elevated px-3.5 py-2 text-[12px] font-medium text-text-secondary hover:border-primary/25 hover:text-primary transition-colors"
          >
            گفتگوی مبدأ
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {dashboard.widgets.map((widget, i) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.05, ...spring.soft }}
              className={cn(
                "relative overflow-hidden rounded-[16px] border border-border-strong bg-bg-elevated p-5 shadow-[var(--shadow-sm)]",
                i === 0 && "sm:col-span-2 xl:col-span-2"
              )}
            >
              <p className="text-[12px] font-medium text-text-muted">
                {widget.label}
              </p>
              <p
                className={cn(
                  "mt-2 text-[32px] font-bold tabular-nums leading-none tracking-tight",
                  toneStyles[widget.tone ?? "default"]
                )}
              >
                {widget.value}
              </p>
              {widget.delta && (
                <p className="mt-2 text-[12px] text-text-tertiary">
                  {widget.delta}
                </p>
              )}
              {widget.description && (
                <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-text-muted">
                  {widget.description}
                </p>
              )}
              {widget.sparkline && widget.sparkline.length > 1 && (
                <Sparkline
                  id={`spark-${widget.id}`}
                  points={widget.sparkline}
                  tone={widget.tone}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
