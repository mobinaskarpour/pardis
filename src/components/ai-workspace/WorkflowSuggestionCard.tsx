"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  GitBranch,
  Sparkles,
  Zap,
} from "lucide-react";
import { spring } from "@/lib/motion";
import type { WorkflowSuggestion } from "@/types";

interface WorkflowSuggestionCardProps {
  suggestion: WorkflowSuggestion;
  onAccept: () => void;
  onDismiss: () => void;
}

export function WorkflowSuggestionCard({
  suggestion,
  onAccept,
  onDismiss,
}: WorkflowSuggestionCardProps) {
  if (suggestion.status === "dismissed") return null;

  if (suggestion.status === "accepted") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.soft}
        className="mb-3 rounded-[12px] border border-success/25 bg-success/5 p-3 text-right"
      >
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 size={15} strokeWidth={1.75} />
          <p className="text-[12px] font-semibold">گردش‌کار ساخته شد</p>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">
          «{suggestion.workflowName}» از این پس {suggestion.triggerLabel}{" "}
          به‌صورت خودکار اجرا می‌شود.
        </p>
        <Link
          href={`/workflows/${suggestion.workflowId}`}
          className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary hover:underline"
        >
          مشاهده و ویرایش گردش‌کار
          <ArrowLeft size={13} strokeWidth={1.75} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={spring.soft}
      className="mb-3 rounded-[12px] border border-accent-indigo/25 bg-accent-indigo/5 p-3 text-right"
    >
      <div className="flex items-center gap-2 text-accent-indigo">
        <Sparkles size={15} strokeWidth={1.75} />
        <p className="text-[12px] font-semibold">الگوی تکراری شناسایی شد</p>
      </div>

      <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">
        {suggestion.reason} می‌خواهید این کار از این پس خودکار انجام شود؟
      </p>

      <div className="mt-2.5 rounded-[10px] border border-border bg-bg-elevated/70 p-2.5">
        <p className="text-[12px] font-medium text-text-primary">
          {suggestion.workflowName}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <Zap size={12} strokeWidth={1.75} />
          {suggestion.triggerLabel}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <GitBranch size={12} strokeWidth={1.75} />
          {suggestion.actionLabels.join(" ← ")}
        </p>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 cursor-pointer rounded-[8px] bg-accent-indigo px-2 py-1.5 text-[12px] font-medium text-white transition-opacity duration-[120ms] hover:opacity-90"
        >
          ساخت گردش‌کار
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="cursor-pointer rounded-[8px] border border-border px-2.5 py-1.5 text-[12px] text-text-tertiary transition-colors duration-[120ms] hover:text-text-secondary"
        >
          فعلاً نه
        </button>
      </div>
    </motion.div>
  );
}
