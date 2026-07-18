"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, Sparkles, X, Zap } from "lucide-react";
import type { WorkflowQueueSuggestion } from "@/types/ai";
import { spring, timing } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { WorkflowGenerationAnimation } from "./WorkflowGenerationAnimation";

interface WorkflowBuilderDialogProps {
  open: boolean;
  suggestion: WorkflowQueueSuggestion | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function WorkflowBuilderDialog({
  open,
  suggestion,
  onClose,
  onConfirm,
}: WorkflowBuilderDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && suggestion?.status !== "generating") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, suggestion?.status]);

  if (typeof document === "undefined") return null;

  const isGenerating =
    suggestion?.status === "generating" && suggestion.generationPhase;

  return createPortal(
    <AnimatePresence>
      {open && suggestion && (
        <>
          <motion.div
            key="wf-builder-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "tween",
              duration: timing.drawer * 0.45,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed inset-0 z-[70] bg-text-primary/25 backdrop-blur-[3px]"
            onClick={isGenerating ? undefined : onClose}
            aria-hidden
          />

          <motion.div
            key="wf-builder-panel"
            role="dialog"
            aria-modal="true"
            aria-label="سازنده Workflow"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className={cn(
              "fixed inset-x-4 top-[8%] z-[71] mx-auto flex max-h-[84vh] w-full max-w-[640px] flex-col overflow-hidden",
              "rounded-[var(--radius-xl)] border border-border bg-bg-elevated",
              "shadow-[var(--shadow-lg)]"
            )}
          >
            <header className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-accent-indigo/12 text-accent-indigo">
                    <GitBranch size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-tight text-text-muted">
                      THEMACHINE · Workflow Builder
                    </p>
                    <h2 className="mt-0.5 text-[18px] font-semibold tracking-tight text-text-primary">
                      {suggestion.workflowName}
                    </h2>
                    <p className="mt-1 text-[12px] text-text-tertiary">
                      {toPersianDigits(suggestion.repeatCount)} بار تکرار ·{" "}
                      {suggestion.triggerLabel}
                    </p>
                  </div>
                </div>
                {!isGenerating && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-text-tertiary transition-colors hover:bg-bg-subtle/80"
                    aria-label="بستن"
                  >
                    <X size={18} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 scrollbar-none">
              {isGenerating ? (
                <div className="mx-auto max-w-md rounded-[16px] border border-primary/15 bg-bg-subtle/30">
                  <WorkflowGenerationAnimation
                    suggestion={{
                      status: "generating",
                      reason: suggestion.reason,
                      workflowId: suggestion.workflowId,
                      workflowName: suggestion.workflowName,
                      dashboardName: suggestion.dashboardName,
                      dashboardWidgets: suggestion.dashboardWidgets,
                      connectedSystems: suggestion.connectedSystems,
                      triggerLabel: suggestion.triggerLabel,
                      actionLabels: suggestion.actionLabels,
                      repeatCount: suggestion.repeatCount,
                      generationPhase: suggestion.generationPhase,
                    }}
                    phase={suggestion.generationPhase!}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-2 rounded-[12px] border border-accent-indigo/15 bg-accent-indigo/[0.06] px-3.5 py-2.5">
                    <Sparkles
                      size={14}
                      className="shrink-0 text-accent-indigo"
                      strokeWidth={1.75}
                    />
                    <p className="text-[12px] leading-relaxed text-text-secondary">
                      Workflow از زمینه گفتگو استخراج شده — بدون پیکربندی دستی.
                      پیش‌نمایش را بررسی و تأیید کنید.
                    </p>
                  </div>

                  <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-text-muted">
                    مراحل فرآیند
                  </p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {suggestion.actionLabels.map((label, i) => (
                      <motion.span
                        key={label + i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + i * 0.05, ...spring.soft }}
                        className="rounded-[8px] border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary"
                      >
                        {i + 1}. {label}
                      </motion.span>
                    ))}
                  </div>

                  <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-text-muted">
                    سیستم‌های متصل
                  </p>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {suggestion.connectedSystems.map((sys) => (
                      <span
                        key={sys}
                        className="rounded-[8px] border border-border bg-bg-layer-1 px-2.5 py-1 text-[11px] text-text-secondary"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>

                  <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-text-muted">
                    ویجت‌های داشبورد همراه
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestion.dashboardWidgets.map((w) => (
                      <span
                        key={w}
                        className="rounded-[8px] border border-border/70 bg-bg-subtle/50 px-2.5 py-1 text-[11px] text-text-tertiary"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {!isGenerating && (
              <footer className="shrink-0 border-t border-border px-5 py-4 sm:px-6">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[11px] px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-text-secondary transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="inline-flex items-center justify-center gap-2 rounded-[11px] bg-accent-indigo px-5 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-sm)] hover:opacity-95 active:scale-[0.98] transition-all"
                  >
                    <Zap size={15} strokeWidth={1.75} />
                    تأیید و ایجاد Workflow
                  </button>
                </div>
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
