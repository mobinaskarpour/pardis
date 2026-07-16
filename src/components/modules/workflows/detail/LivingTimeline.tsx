"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { WorkflowRun } from "@/types/workflow";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface LivingTimelineProps {
  runs: WorkflowRun[];
}

export function LivingTimeline({ runs }: LivingTimelineProps) {
  if (runs.length === 0) {
    return (
      <p className="text-[14px] text-text-muted py-8 text-center">
        هنوز اجرایی ثبت نشده
      </p>
    );
  }

  return (
    <div className="relative ps-1">
      <div className="absolute top-0 bottom-0 start-[15px] w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
      <ul className="space-y-8">
        {runs.map((run, i) => (
          <motion.li
            key={run.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, ...spring.soft }}
            className="relative flex gap-5 ps-10"
          >
            <div
              className={cn(
                "absolute start-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-[#f6f7f9]",
                run.status === "success" ? "border-success text-success" : "border-error text-error"
              )}
            >
              {run.status === "success" ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
            </div>
            <div className="pt-0.5">
              <time className="text-[12px] font-mono tabular-nums text-text-muted">
                {run.time}
              </time>
              <p className="mt-1 text-[16px] font-semibold text-text-primary leading-snug">
                {run.detail ?? "اجرای موفق"}
              </p>
              <span
                className={cn(
                  "mt-2 inline-block text-[10px] font-bold uppercase tracking-wider",
                  run.status === "success" ? "text-success" : "text-error"
                )}
              >
                {run.status === "success" ? "Completed" : "Failed"}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
