"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GitBranch, Sparkles } from "lucide-react";
import { Card } from "@/components/core";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { useWorkflowStore } from "@/store/workflow-store";
import { workflowStatus } from "@/types/workflow";

export function WorkflowInsightsPanel() {
  const workflows = useWorkflowStore((s) => s.workflows);
  const active = workflows.filter((w) => workflowStatus(w) === "active");
  const aiGenerated = workflows.filter((w) => w.source === "ai");
  const featured = workflows.find((w) => w.id === "wf-mri-report-prep");
  const widgets = featured?.dashboardWidgets.slice(0, 4) ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, ...spring.soft }}
      className="mt-6"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            THEMACHINE Learning Loop
          </p>
          <h2 className="text-[18px] font-semibold text-text-primary">
            بینش‌های گردش‌کار
          </h2>
          <p className="mt-1 text-[13px] text-text-tertiary">
            ویجت‌ها خودکار از اجرای گردش‌کارها ساخته می‌شوند
          </p>
        </div>
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
        >
          همه گردش‌کارها
          <ArrowLeft size={14} strokeWidth={1.75} />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card hover={false} className="border-primary/10 bg-gradient-to-l from-primary/[0.03] to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary/10">
              <GitBranch size={18} className="text-primary" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[22px] font-bold text-text-primary tabular-nums">
                {toPersianDigits(active.length)}
              </p>
              <p className="text-[12px] text-text-tertiary">گردش‌کار فعال</p>
            </div>
            <div className="mr-auto text-left">
              <p className="text-[22px] font-bold text-accent-indigo tabular-nums">
                {toPersianDigits(aiGenerated.length)}
              </p>
              <p className="text-[12px] text-text-tertiary flex items-center gap-1">
                <Sparkles size={12} />
                AI Generated
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-text-secondary">
            گفتگو → الگو → پیشنهاد → تأیید → گردش‌کار → داشبورد.{" "}
            {toPersianDigits(
              workflows.reduce((s, w) => s + w.runsToday, 0)
            )}{" "}
            اجرای امروز در مرکز پردیس نور.
          </p>
        </Card>

        <Card hover={false} hero="MRI Report Workflow" subtitle="ویجت‌های تولیدشده خودکار">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {widgets.map((w) => (
              <div
                key={w.id}
                className="rounded-[12px] border border-border/60 bg-bg-subtle/30 px-3 py-2.5"
              >
                <p className="text-[10px] text-text-muted truncate">{w.label}</p>
                <p className="text-[16px] font-bold text-text-primary tabular-nums">
                  {w.value}
                </p>
                {w.trend && (
                  <p className="text-[10px] font-medium text-success">{w.trend}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
