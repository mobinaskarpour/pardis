"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, LayoutDashboard, X, Zap } from "lucide-react";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import type { WorkflowSuggestion } from "@/types/ai";
import { cn } from "@/lib/utils";
import { WorkflowGenerationAnimation } from "./WorkflowGenerationAnimation";

interface WorkflowSuggestionCardProps {
  suggestion: WorkflowSuggestion;
  onAccept: () => void;
  onDismiss: () => void;
  variant?: "inline" | "notification";
}

export function WorkflowSuggestionCard({
  suggestion,
  onAccept,
  onDismiss,
  variant = "inline",
}: WorkflowSuggestionCardProps) {
  if (suggestion.status === "dismissed") return null;

  const isNotification = variant === "notification";

  const shell = cn(
    "relative w-full overflow-hidden rounded-[14px] border",
    "bg-bg-elevated/98 backdrop-blur-xl",
    isNotification
      ? "shadow-[0_16px_50px_rgba(15,23,42,0.14),0_4px_16px_rgba(91,95,199,0.12)]"
      : "mx-auto max-w-[360px] shadow-[0_12px_48px_rgba(91,95,199,0.18),var(--shadow-md)]"
  );

  if (suggestion.status === "generating" && suggestion.generationPhase) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={spring.soft}
        className={cn(shell, "border-primary/20")}
      >
        <WorkflowGenerationAnimation
          suggestion={suggestion}
          phase={suggestion.generationPhase}
        />
      </motion.div>
    );
  }

  if (suggestion.status === "accepted") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={spring.soft}
        className={cn(shell, "border-success/25 p-3")}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-success/12 text-[16px]">
            ✅
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-text-primary">Workflow ایجاد شد</p>
            <p className="text-[11px] text-text-muted truncate">{suggestion.workflowName}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-text-muted hover:bg-bg-subtle transition-colors"
            aria-label="بستن"
          >
            <X size={12} />
          </button>
        </div>
        <div className="mt-2.5 flex gap-2">
          <Link
            href={`/workflows/${suggestion.workflowId}`}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-[9px] bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-primary-muted transition-colors"
          >
            <GitBranch size={12} />
            Workflow
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-[9px] border border-border bg-bg-subtle/60 px-2.5 py-1.5 text-[11px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <LayoutDashboard size={12} />
            Dashboard
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ...spring.soft }}
        className={cn(shell, "border-accent-indigo/20")}
      >
        <div className="p-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-accent-indigo/10 text-[16px]">
              🧠
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-text-primary leading-tight">
                    فرآیند تکراری شناسایی شد
                  </p>
                  <p className="mt-0.5 text-[10px] text-text-muted">
                    {toPersianDigits(suggestion.repeatCount)} بار تکرار · قابل خودکارسازی
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-text-muted hover:bg-bg-subtle hover:text-text-secondary transition-colors"
                  aria-label="بستن"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="mt-2 truncate text-[11px] font-semibold text-text-primary">
                {suggestion.workflowName}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex gap-1.5">
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-[9px] bg-accent-indigo px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <Zap size={11} strokeWidth={2} />
              ایجاد Workflow
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-[9px] px-2.5 py-1.5 text-[10px] font-medium text-text-muted hover:text-text-secondary transition-colors"
            >
              بعداً
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
