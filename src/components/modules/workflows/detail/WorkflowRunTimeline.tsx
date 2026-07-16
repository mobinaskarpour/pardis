"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowRun } from "@/types/workflow";

interface WorkflowRunTimelineProps {
  runs: WorkflowRun[];
}

export function WorkflowRunTimeline({ runs }: WorkflowRunTimelineProps) {
  if (runs.length === 0) {
    return (
      <p className="text-[13px] text-text-muted py-4 text-center">
        هنوز اجرایی ثبت نشده
      </p>
    );
  }

  return (
    <div className="relative pr-6">
      <div className="absolute top-2 bottom-2 start-[11px] w-0.5 bg-border/80 rounded-full" />

      <ul className="space-y-4">
        {runs.map((run, i) => (
          <li key={run.id} className="relative flex gap-4">
            <div
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                run.status === "success"
                  ? "border-success text-success"
                  : "border-error text-error"
              )}
            >
              {run.status === "success" ? (
                <CheckCircle2 size={14} strokeWidth={2} />
              ) : (
                <XCircle size={14} strokeWidth={2} />
              )}
            </div>

            <div
              className={cn(
                "flex-1 rounded-[14px] border px-4 py-3",
                i === 0
                  ? "border-primary/20 bg-primary/[0.03]"
                  : "border-border/60 bg-white"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-text-primary">
                  {run.time}
                </p>
                <span
                  className={cn(
                    "rounded-[6px] px-2 py-0.5 text-[10px] font-bold",
                    run.status === "success"
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  )}
                >
                  {run.status === "success" ? "موفق" : "ناموفق"}
                </span>
              </div>
              {run.detail && (
                <p className="mt-1 text-[12px] text-text-tertiary leading-relaxed">
                  {run.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
