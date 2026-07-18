"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  GitBranch,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Card, Status } from "@/components/core";
import { DynamicWidgetViz } from "@/components/dashboard/widgets/DynamicWidgetViz";
import {
  buildMetricDetailContext,
} from "@/lib/analytics-metrics";
import { useWorkflowStore } from "@/store/workflow-store";
import { workflowStatus } from "@/types/workflow";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { MetricTimeSeriesChart } from "./charts/MetricTimeSeriesChart";
import { MetricHeatmapPanel } from "./charts/MetricHeatmapPanel";
import { MetricBreakdownChart } from "./charts/MetricBreakdownChart";
import { MetricTimelinePanel } from "./charts/MetricTimelinePanel";

interface AnalyticsDetailPageProps {
  metricId: string;
}

export function AnalyticsDetailPage({ metricId }: AnalyticsDetailPageProps) {
  const workflows = useWorkflowStore((s) => s.workflows);

  const ctx = useMemo(
    () => buildMetricDetailContext(workflows, metricId),
    [workflows, metricId]
  );

  if (!ctx) {
    return (
      <AppShell pageTitle="تحلیل">
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-text-secondary">متریک یافت نشد</p>
        </div>
      </AppShell>
    );
  }

  const { metric, workflow: wf, siblingMetrics, comparison } = ctx;
  const sparkline = metric.sparkline ?? [10, 12, 11, 14, 13, 15, 16, 17];
  const status = workflowStatus(wf);
  const trendUp = comparison.changePct >= 0;

  return (
    <AppShell pageTitle={metric.label}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-tertiary hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          بازگشت به مرکز فرمان
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-text-tertiary">
                {metric.domainLabel} · تحلیل متریک
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2.5">
                <h1 className="text-[36px] font-semibold leading-tight text-text-primary">
                  {metric.label}
                </h1>
                <Status
                  label={status === "active" ? "Live" : status === "warning" ? "هشدار" : "متوقف"}
                  tone={
                    status === "active"
                      ? "success"
                      : status === "warning"
                        ? "warning"
                        : "neutral"
                  }
                  pulse={status === "active"}
                />
              </div>
            </div>
            <Link href={`/workflows/${wf.id}`}>
              <span className="inline-flex items-center gap-2 rounded-[12px] border border-border bg-bg-elevated px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:border-primary/20 hover:text-primary transition-colors">
                <GitBranch size={14} strokeWidth={1.75} />
                {wf.name}
              </span>
            </Link>
          </div>
        </motion.header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card variant="default" hover={false} padding="md">
            <p className="text-[11px] font-medium text-text-muted mb-1">مقدار فعلی</p>
            <p className="text-[28px] font-bold text-text-primary tabular-nums leading-none">
              {toPersianDigits(metric.value)}
            </p>
            {metric.trend && (
              <p className="mt-2 text-[12px] font-medium text-success">
                {toPersianDigits(metric.trend)}
              </p>
            )}
          </Card>
          <Card variant="status" hover={false} padding="md">
            <p className="text-[11px] font-medium text-text-muted mb-1">نسبت به دیروز</p>
            <p
              className={cn(
                "text-[28px] font-bold tabular-nums leading-none flex items-center gap-1",
                trendUp ? "text-success" : "text-error"
              )}
            >
              {trendUp ? (
                <ArrowUp size={20} strokeWidth={2.5} />
              ) : (
                <ArrowDown size={20} strokeWidth={2.5} />
              )}
              {toPersianDigits(Math.abs(comparison.changePct))}٪
            </p>
            <p className="mt-2 text-[12px] text-text-muted">
              {toPersianDigits(comparison.previous)} ← {toPersianDigits(comparison.latest)}
            </p>
          </Card>
          <Card variant="status" hover={false} padding="md">
            <p className="text-[11px] font-medium text-text-muted mb-1">میانگین هفته</p>
            <p className="text-[28px] font-bold text-text-primary tabular-nums leading-none">
              {toPersianDigits(comparison.weekAvg)}
            </p>
            <p className="mt-2 text-[12px] text-text-muted">
              کمینه {toPersianDigits(comparison.weekLow)} · بیشینه{" "}
              {toPersianDigits(comparison.weekHigh)}
            </p>
          </Card>
          <Card variant="finance" hover={false} padding="md">
            <p className="text-[11px] font-medium text-text-muted mb-1">اجرای فرآیند</p>
            <p className="text-[28px] font-bold text-text-primary tabular-nums leading-none">
              {toPersianDigits(wf.runsToday)}
            </p>
            <p className="mt-2 text-[12px] text-text-muted">
              موفقیت {toPersianDigits(wf.successRate)}٪ · {wf.lastRun}
            </p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, ...spring.soft }}
            className="lg:col-span-8"
          >
            <Card
              hero={
                <span className="flex items-center gap-2">
                  <BarChart3 size={16} strokeWidth={1.75} className="text-primary" />
                  روند ۷ روز اخیر
                </span>
              }
              subtitle="سری زمانی از اجرای گردش‌کار"
              hover={false}
              padding="lg"
            >
              <MetricTimeSeriesChart points={sparkline} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, ...spring.soft }}
            className="lg:col-span-4"
          >
            <Card
              hero="نمای زنده"
              subtitle={metric.category}
              hover={false}
              padding="lg"
              className="h-full"
            >
              <DynamicWidgetViz
                widget={{
                  id: metric.id,
                  label: metric.label,
                  value: metric.value,
                  vizType: metric.vizType,
                  numericValue: metric.numericValue,
                  healthScore: metric.healthScore,
                  sparkline: metric.sparkline,
                  timeline: metric.timeline,
                  heatmap: metric.heatmap,
                  related: metric.related,
                  trend: metric.trend,
                }}
                live
                featured
              />
            </Card>
          </motion.div>

          {metric.related && metric.related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...spring.soft }}
              className="lg:col-span-6"
            >
              <Card hero="تفکیک" hover={false} padding="lg">
                <MetricBreakdownChart items={metric.related} />
              </Card>
            </motion.div>
          )}

          {metric.heatmap && metric.heatmap.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...spring.soft }}
              className={cn(
                "lg:col-span-6",
                !metric.related?.length && "lg:col-span-12"
              )}
            >
              <Card hero="الگوی زمانی" hover={false} padding="lg">
                <MetricHeatmapPanel cells={metric.heatmap} />
              </Card>
            </motion.div>
          )}

          {metric.timeline && metric.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, ...spring.soft }}
              className="lg:col-span-6"
            >
              <Card hero="رویدادهای اخیر" hover={false} padding="lg">
                <MetricTimelinePanel events={metric.timeline} />
              </Card>
            </motion.div>
          )}

          {metric.aiInsight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, ...spring.soft }}
              className="lg:col-span-6"
            >
              <Card variant="insight" hover={false} padding="lg">
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={18}
                    strokeWidth={1.75}
                    className="text-accent-indigo shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[15px] font-semibold text-text-primary mb-2">
                      بینش THEMACHINE
                    </p>
                    <p className="text-[14px] leading-relaxed text-text-secondary">
                      {metric.aiInsight}
                    </p>
                    {metric.forecast && (
                      <p className="mt-3 flex items-center gap-1.5 text-[13px] text-primary font-medium">
                        <TrendingUp size={14} />
                        {metric.forecast}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {siblingMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, ...spring.soft }}
              className="lg:col-span-12"
            >
              <Card
                hero={
                  <span className="flex items-center gap-2">
                    <Zap size={15} className="text-primary" />
                    متریک‌های مرتبط — {wf.name}
                  </span>
                }
                hover={false}
                padding="lg"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {siblingMetrics.slice(0, 4).map((sib) => (
                    <Link
                      key={sib.id}
                      href={`/analytics/${encodeURIComponent(sib.id)}`}
                      className="group rounded-[14px] border border-border bg-bg-subtle/40 p-4 transition-all hover:border-primary/20 hover:bg-bg-elevated hover:shadow-[var(--shadow-sm)]"
                    >
                      <p className="text-[11px] font-medium text-text-muted truncate">
                        {sib.label}
                      </p>
                      <p className="mt-1 text-[22px] font-bold text-text-primary tabular-nums">
                        {toPersianDigits(sib.value)}
                      </p>
                      {sib.trend && (
                        <p className="mt-1 text-[11px] text-success">
                          {toPersianDigits(sib.trend)}
                        </p>
                      )}
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        مشاهده
                        <ArrowLeft size={11} />
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
        </div>
      </div>
    </AppShell>
  );
}
