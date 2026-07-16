"use client";

import { motion } from "framer-motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { DynamicWidgetViz } from "@/components/dashboard/widgets/DynamicWidgetViz";
import type { Workflow } from "@/types/workflow";
import type { DashboardWidgetInstance } from "@/lib/dashboard-widgets";

function DonutChart({
  value,
  label,
  color = "var(--primary)",
  size = 88,
}: {
  value: number;
  label: string;
  color?: string;
  size?: number;
}) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-subtle)"
          strokeWidth="7"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[18px] font-bold text-text-primary tabular-nums rotate-0">
          {toPersianDigits(value)}٪
        </p>
      </div>
      <p className="mt-2 text-[11px] font-medium text-text-muted">{label}</p>
    </div>
  );
}

function WeeklyRunsChart({ runsToday }: { runsToday: number }) {
  const days = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const base = runsToday / 7;
  const values = days.map((_, i) =>
    Math.round(base * (0.7 + Math.sin(i * 1.2) * 0.3 + i * 0.05))
  );
  const max = Math.max(...values, 1);

  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold text-text-muted">
        اجرای هفتگی
      </p>
      <div className="flex items-end gap-1.5 h-20">
        {values.map((v, i) => (
          <div key={days[i]} className="flex flex-1 flex-col items-center gap-1 h-full">
            <div className="flex flex-1 w-full items-end">
              <motion.div
                className="w-full rounded-[6px] bg-primary/80 origin-bottom"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? 4 : 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              />
            </div>
            <span className="text-[9px] text-text-muted">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkflowKpiStrip({ wf }: { wf: Workflow }) {
  const items = [
    { label: "Automation Score", value: toPersianDigits(wf.automationScore), accent: true },
    { label: "نرخ موفقیت", value: `${toPersianDigits(wf.successRate)}٪` },
    { label: "اجرای امروز", value: toPersianDigits(wf.runsToday) },
    { label: "میانگین مدت", value: wf.performance.avgDuration },
    { label: "ROI تخمینی", value: wf.performance.estimatedROI },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className={cn(
            "rounded-[14px] border px-4 py-3.5",
            item.accent
              ? "border-primary/25 bg-primary/[0.06]"
              : "border-border/60 bg-white"
          )}
        >
          <p
            className={cn(
              "text-[22px] font-bold tabular-nums leading-none",
              item.accent ? "text-primary" : "text-text-primary"
            )}
          >
            {item.value}
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-text-muted">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function WorkflowWidgetGallery({
  widgets,
  highlightWidget,
}: {
  widgets: DashboardWidgetInstance[];
  highlightWidget?: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {widgets.map((w, i) => (
        <motion.div
          key={w.id}
          id={`widget-${w.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i }}
          className={cn(
            "scroll-mt-28 rounded-[18px] border bg-white p-5 min-h-[156px] flex flex-col",
            "shadow-[0_2px_8px_rgba(17,19,24,0.04)] transition-all duration-500",
            highlightWidget === w.id
              ? "border-primary/40 ring-2 ring-primary/20 bg-primary/[0.02]"
              : "border-border/60 hover:border-primary/20 hover:shadow-md"
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <p className="text-[12px] font-semibold text-text-secondary">
              {w.label}
            </p>
            {w.trend && (
              <span className="shrink-0 rounded-[6px] bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
                {toPersianDigits(w.trend)}
              </span>
            )}
          </div>
          <div className="flex-1 flex items-end">
            <DynamicWidgetViz widget={w} live />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function WorkflowPerformancePanel({ wf }: { wf: Workflow }) {
  return (
    <div className="rounded-[18px] border border-border/60 bg-white p-5 space-y-6">
      <h3 className="text-[14px] font-semibold text-text-primary">عملکرد</h3>

      <div className="flex justify-around gap-4 border-b border-border/50 pb-6">
        <DonutChart value={wf.successRate} label="نرخ موفقیت" color="var(--success)" />
        <DonutChart
          value={wf.automationScore}
          label="اتوماسیون"
          color="var(--primary)"
        />
      </div>

      <WeeklyRunsChart runsToday={wf.runsToday} />

      <div className="space-y-3 pt-2">
        {[
          { label: "زمان صرفه‌جویی", value: wf.performance.timeSaved },
          { label: "آخرین اجرا", value: wf.lastRun },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-[10px] bg-[#f6f7f9] px-3 py-2.5"
          >
            <span className="text-[12px] text-text-tertiary">{row.label}</span>
            <span className="text-[13px] font-semibold text-text-primary">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
