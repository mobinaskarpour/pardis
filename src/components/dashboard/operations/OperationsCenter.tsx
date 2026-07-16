"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useWorkflowStore } from "@/store/workflow-store";
import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { buildHeroDashboardCards, parseMetricId } from "@/lib/analytics-metrics";
import {
  buildActivityHeatmap,
  buildExecutionMap,
  buildOperationalEvents,
  buildOperationsNarrative,
  buildWorkflowHealth,
} from "@/lib/operations-data";
import { ExecutionMap } from "./ExecutionMap";
import { OperationalTimeline } from "./OperationalTimeline";
import { RadialHealthGrid } from "./RadialHealthGrid";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { MetricStream, AIInsightBlock } from "./MetricStream";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

interface OperationsCenterProps {
  onOpenSearch?: () => void;
}

export function OperationsCenter({ onOpenSearch }: OperationsCenterProps) {
  const workflows = useWorkflowStore((s) => s.workflows);
  const { currentInsight, allWidgets } = useLiveDashboard(workflows);

  const narrative = useMemo(() => buildOperationsNarrative(workflows), [workflows]);
  const executionMap = useMemo(() => buildExecutionMap(workflows), [workflows]);
  const events = useMemo(() => buildOperationalEvents(workflows), [workflows]);
  const heatmap = useMemo(() => buildActivityHeatmap(), []);
  const health = useMemo(() => buildWorkflowHealth(workflows), [workflows]);

  const metrics = useMemo(() => {
    const base = buildHeroDashboardCards(workflows);
    return base.map((card) => {
      const parsed = parseMetricId(card.metricId);
      if (!parsed) return card;
      const live = allWidgets.find(
        (w) => w.workflowId === parsed.workflowId && w.id === parsed.widgetId
      );
      if (!live) return card;
      return { ...card, value: live.value };
    });
  }, [workflows, allWidgets]);

  const now = new Date();
  const timeLabel = `${toPersianDigits(now.getHours())}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="h-full overflow-y-auto bg-[#f6f7f9] scrollbar-none">
      {/* Minimal top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/40 bg-[#f6f7f9]/90 px-8 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[12px] font-medium text-text-muted">
            Live · {timeLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-[12px] text-text-muted hover:border-primary/20 transition-colors"
        >
          <Search size={14} />
          پرسش از AI
        </button>
        <Link
          href="/chat"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111318] text-white hover:bg-[#1a1d24] transition-colors"
        >
          <Sparkles size={15} />
        </Link>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-14">
        {/* HERO — dominant */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="mb-16 md:mb-20"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted mb-4">
            Mission Control · پردیس نور
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-text-primary max-w-4xl">
            {narrative.headline}
          </h1>
          <p className="mt-6 text-[18px] md:text-[20px] leading-relaxed text-text-secondary max-w-2xl font-light">
            {narrative.subline}
          </p>
          {narrative.alertCount > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
              {toPersianDigits(narrative.alertCount)} هشدار فعال
            </p>
          )}
        </motion.header>

        {/* Asymmetric grid */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Execution map — spans 8 cols */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...spring.soft }}
            className="lg:col-span-8"
          >
            <h2 className="text-[13px] font-semibold text-text-muted mb-4 uppercase tracking-wider">
              نقشه اجرا
            </h2>
            <ExecutionMap nodes={executionMap} />
          </motion.section>

          {/* Timeline — 4 cols */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ...spring.soft }}
            className="lg:col-span-4 lg:pt-8"
          >
            <h2 className="text-[13px] font-semibold text-text-muted mb-4 uppercase tracking-wider">
              جریان عملیات
            </h2>
            <OperationalTimeline events={events} />
          </motion.section>

          {/* AI Insight — full width */}
          <section className="lg:col-span-12 mt-4">
            <AIInsightBlock insight={currentInsight} />
          </section>

          {/* Health rings — 5 cols */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...spring.soft }}
            className="lg:col-span-5"
          >
            <h2 className="text-[13px] font-semibold text-text-muted mb-6 uppercase tracking-wider">
              سلامت فرآیندها
            </h2>
            <RadialHealthGrid items={health} />
          </motion.section>

          {/* Heatmap — 7 cols */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ...spring.soft }}
            className={cn(
              "lg:col-span-7 rounded-[24px] border border-border/40 bg-white p-6 md:p-8"
            )}
          >
            <h2 className="text-[13px] font-semibold text-text-muted mb-6 uppercase tracking-wider">
              فعالیت هفتگی
            </h2>
            <ActivityHeatmap grid={heatmap} />
            <p className="mt-4 text-[11px] text-text-muted">
              شدت فعالیت اجرای گردش‌کارها — تیره‌تر = بار بیشتر
            </p>
          </motion.section>

          {/* Metric stream — full width */}
          <section className="lg:col-span-12 mt-6">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider">
                متریک‌های زنده
              </h2>
              <Link
                href="/workflows"
                className="text-[12px] font-medium text-primary hover:underline"
              >
                مدیریت فرآیندها ←
              </Link>
            </div>
            <MetricStream metrics={metrics} />
          </section>
        </div>
      </div>
    </div>
  );
}
