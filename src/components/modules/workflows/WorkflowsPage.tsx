"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  PauseCircle,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { ModuleHero } from "@/components/modules/shared/ModuleShell";
import { Card, Status, type StatusTone } from "@/components/core";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/store/workflow-store";
import { workflowStatus, type Workflow, type WorkflowStatus } from "@/types/workflow";
import { triggerLabelFor } from "@/lib/workflow-detection";
import { optionLabel, triggerEvents } from "@/config/workflow-options";
import { pageLabels } from "@/config/labels";

const statusMeta: Record<
  WorkflowStatus,
  { label: string; tone: StatusTone; pulse?: boolean }
> = {
  active: { label: "فعال", tone: "success", pulse: true },
  warning: { label: "هشدار", tone: "warning" },
  error: { label: "خطا", tone: "error" },
  paused: { label: "متوقف", tone: "neutral" },
};

function rateColor(rate: number) {
  if (rate >= 95) return "bg-success";
  if (rate >= 85) return "bg-warning";
  return "bg-error";
}

function triggerText(wf: Workflow): string {
  if (wf.trigger.type === "event")
    return optionLabel(triggerEvents, wf.trigger.event);
  return triggerLabelFor(wf);
}

function WorkflowRow({ wf, index }: { wf: Workflow; index: number }) {
  const status = workflowStatus(wf);
  const meta = statusMeta[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, ...spring.soft }}
    >
      <Link href={`/workflows/${wf.id}`} className="block group">
        <Card variant="workflow" hover className="cursor-pointer">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  {wf.name}
                </h3>
                <Status label={meta.label} tone={meta.tone} pulse={meta.pulse} />
                {wf.source === "ai" && (
                  <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-accent-indigo/10 px-2 py-0.5 text-[12px] font-medium text-accent-indigo">
                    <Sparkles size={12} strokeWidth={1.75} />
                    ساخته‌شده از گفتگو
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                {wf.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-2 text-[12px] text-text-tertiary">
                <Zap size={14} strokeWidth={1.75} />
                {triggerText(wf)}
              </span>
              <ChevronLeft
                size={16}
                strokeWidth={1.75}
                className="text-text-tertiary transition-transform duration-[120ms] group-hover:-translate-x-0.5"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px]">
            <span className="flex items-center gap-1.5 text-text-tertiary">
              <Clock3 size={14} strokeWidth={1.75} />
              آخرین اجرا:{" "}
              <span className="text-text-secondary">{wf.lastRun}</span>
            </span>
            <span className="text-text-tertiary">
              اجرای امروز:{" "}
              <span className="font-medium text-text-secondary">
                {toPersianDigits(wf.runsToday)}
              </span>
            </span>
            <span className="flex items-center gap-2.5 text-text-tertiary">
              نرخ موفقیت:
              <span className="relative h-1.5 w-24 overflow-hidden rounded-full bg-bg-subtle">
                <span
                  className={cn(
                    "absolute inset-y-0 right-0 rounded-full",
                    rateColor(wf.successRate)
                  )}
                  style={{ width: `${wf.successRate}%` }}
                />
              </span>
              <span className="font-medium text-text-secondary">
                {toPersianDigits(wf.successRate)}٪
              </span>
            </span>
          </div>

          {wf.issue && (
            <div
              className={cn(
                "mt-4 flex items-start gap-2.5 rounded-[10px] border p-3 text-[13px] leading-relaxed",
                status === "error"
                  ? "border-error/25 bg-error/5 text-error"
                  : "border-warning/25 bg-warning/5 text-warning"
              )}
            >
              {status === "error" ? (
                <XCircle
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <AlertTriangle
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0"
                />
              )}
              {wf.issue}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}

export function WorkflowsPage() {
  const workflows = useWorkflowStore((s) => s.workflows);

  const counts = {
    active: workflows.filter((w) => workflowStatus(w) === "active").length,
    warning: workflows.filter((w) => workflowStatus(w) === "warning").length,
    error: workflows.filter((w) => workflowStatus(w) === "error").length,
    paused: workflows.filter((w) => workflowStatus(w) === "paused").length,
  };

  const summary = [
    {
      id: "active",
      label: "فعال",
      count: counts.active,
      icon: CheckCircle2,
      className: "text-success",
    },
    {
      id: "warning",
      label: "هشدار",
      count: counts.warning,
      icon: AlertTriangle,
      className: "text-warning",
    },
    {
      id: "error",
      label: "خطا",
      count: counts.error,
      icon: XCircle,
      className: "text-error",
    },
    {
      id: "paused",
      label: "متوقف",
      count: counts.paused,
      icon: PauseCircle,
      className: "text-text-tertiary",
    },
  ];

  const needsAttention = counts.warning + counts.error;

  return (
    <AppShell pageTitle={pageLabels.workflows}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <ModuleHero
          title={pageLabels.workflows}
          subtitle="بخش سی‌تی اسکن"
          aiSummary={`${toPersianDigits(workflows.length)} گردش‌کار تعریف شده — ${
            needsAttention > 0
              ? `${toPersianDigits(needsAttention)} مورد نیاز به بررسی دارد.`
              : "همه‌چیز عادی است."
          } گردش‌کارهای جدید را می‌توانید از دل گفتگو با AI بسازید.`}
        />

        <div className="mb-6 flex flex-wrap gap-3">
          {summary.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-3.5 py-2"
              >
                <Icon size={16} strokeWidth={1.75} className={s.className} />
                <span className="text-[13px] text-text-secondary">
                  {s.label}
                </span>
                <span className="text-[15px] font-semibold text-text-primary">
                  {toPersianDigits(s.count)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl space-y-4 pb-8">
          {workflows.map((wf, i) => (
            <WorkflowRow key={wf.id} wf={wf} index={i} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
