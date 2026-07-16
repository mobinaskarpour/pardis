"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock3, Sparkles, Zap } from "lucide-react";
import { Card, Status, type StatusTone } from "@/components/core";
import { getCategoryEmoji, getCategoryLabel } from "@/config/workflow-categories";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { workflowStatus, type Workflow, type WorkflowStatus } from "@/types/workflow";
import { triggerLabelFor } from "@/lib/workflow-detection";
import { optionLabel, triggerEvents } from "@/config/workflow-options";

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

function scoreColor(score: number) {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-primary";
  return "text-warning";
}

function triggerText(wf: Workflow): string {
  if (wf.trigger.type === "event")
    return optionLabel(triggerEvents, wf.trigger.event);
  return triggerLabelFor(wf);
}

function MiniPreview({ steps }: { steps: string[] }) {
  const shown = steps.slice(0, 5);
  return (
    <div className="flex items-center gap-1 overflow-hidden py-1">
      {shown.map((step, i) => (
        <div key={step} className="flex items-center gap-1 shrink-0">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
              i === 0
                ? "bg-primary/10 text-primary"
                : "bg-bg-subtle/80 text-text-tertiary"
            )}
          >
            {step}
          </span>
          {i < shown.length - 1 && (
            <span className="text-[10px] text-text-muted">←</span>
          )}
        </div>
      ))}
    </div>
  );
}

interface WorkflowCardProps {
  wf: Workflow;
  index: number;
}

export function WorkflowCard({ wf, index }: WorkflowCardProps) {
  const status = workflowStatus(wf);
  const meta = statusMeta[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, ...spring.soft }}
    >
      <Link href={`/workflows/${wf.id}`} className="block group">
        <Card
          variant="workflow"
          hover
          className="cursor-pointer overflow-hidden transition-shadow duration-[200ms] group-hover:shadow-[0_12px_40px_rgba(17,19,24,0.1)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[18px]" aria-hidden>
                  {getCategoryEmoji(wf.category)}
                </span>
                <h3 className="text-[16px] font-semibold text-text-primary">
                  {wf.name}
                </h3>
                <Status label={meta.label} tone={meta.tone} pulse={meta.pulse} />
                {wf.source === "ai" && (
                  <span className="inline-flex items-center gap-1 rounded-[6px] bg-accent-indigo/10 px-2 py-0.5 text-[11px] font-semibold text-accent-indigo">
                    <Sparkles size={11} strokeWidth={2} />
                    AI Generated
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary line-clamp-2">
                {wf.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={cn(
                  "text-[22px] font-bold tabular-nums leading-none",
                  scoreColor(wf.automationScore)
                )}
              >
                {toPersianDigits(wf.automationScore)}
              </span>
              <span className="text-[10px] font-medium text-text-muted">
                Automation Score
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-[12px] border border-border/60 bg-bg-subtle/30 px-3 opacity-80 transition-opacity duration-[200ms] group-hover:opacity-100">
            <MiniPreview steps={wf.previewSteps} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]">
            <span className="flex items-center gap-1.5 text-text-tertiary">
              <Zap size={13} strokeWidth={1.75} />
              {triggerText(wf)}
            </span>
            <span className="flex items-center gap-1.5 text-text-tertiary">
              <Clock3 size={13} strokeWidth={1.75} />
              {wf.performance.avgDuration}
            </span>
            <span className="text-text-tertiary">
              امروز:{" "}
              <span className="font-medium text-text-secondary">
                {toPersianDigits(wf.runsToday)}
              </span>
            </span>
            <span className="flex items-center gap-2 text-text-tertiary">
              موفقیت:
              <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-bg-subtle">
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

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
            <div className="flex flex-wrap gap-1.5">
              {wf.connectedSystems.slice(0, 4).map((sys) => (
                <span
                  key={sys}
                  className="rounded-[6px] bg-white/80 px-2 py-0.5 text-[10px] font-medium text-text-tertiary ring-1 ring-border/60"
                >
                  {sys}
                </span>
              ))}
              {wf.connectedSystems.length > 4 && (
                <span className="rounded-[6px] px-1.5 py-0.5 text-[10px] text-text-muted">
                  +{toPersianDigits(wf.connectedSystems.length - 4)}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-[11px] text-text-muted">
              {getCategoryLabel(wf.category)}
              <ArrowLeft
                size={14}
                strokeWidth={1.75}
                className="transition-transform duration-[140ms] group-hover:-translate-x-0.5"
              />
            </span>
          </div>

          {wf.issue && (
            <div className="mt-3 rounded-[10px] border border-warning/25 bg-warning/5 px-3 py-2 text-[12px] text-warning">
              {wf.issue}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}
