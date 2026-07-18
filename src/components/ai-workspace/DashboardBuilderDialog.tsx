"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Sparkles, X } from "lucide-react";
import type { DashboardSuggestion } from "@/types/ai";
import { spring, timing } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { DashboardGenerationAnimation } from "./DashboardGenerationAnimation";

interface DashboardBuilderDialogProps {
  open: boolean;
  suggestion: DashboardSuggestion | null;
  onClose: () => void;
  onConfirm: () => void;
}

const toneStyles = {
  default: "text-text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
  info: "text-primary",
} as const;

function MiniSparkline({
  points,
  tone = "default",
}: {
  points: number[];
  tone?: keyof typeof toneStyles;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 120;
  const h = 28;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 3 - ((p - min) / range) * (h - 6);
      return `${x},${y}`;
    })
    .join(" ");

  const color =
    tone === "success"
      ? "var(--success)"
      : tone === "warning"
        ? "var(--warning)"
        : tone === "danger"
          ? "var(--error)"
          : "var(--primary)";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-7 w-full opacity-70"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

export function DashboardBuilderDialog({
  open,
  suggestion,
  onClose,
  onConfirm,
}: DashboardBuilderDialogProps) {
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
            key="dash-builder-backdrop"
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
            key="dash-builder-panel"
            role="dialog"
            aria-modal="true"
            aria-label="سازنده داشبورد"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className={cn(
              "fixed inset-x-4 top-[8%] z-[71] mx-auto flex max-h-[84vh] w-full max-w-[720px] flex-col overflow-hidden",
              "rounded-[var(--radius-xl)] border border-border bg-bg-elevated",
              "shadow-[var(--shadow-lg)]"
            )}
          >
            <header className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-accent-indigo/12 text-accent-indigo">
                    <LayoutDashboard size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-tight text-text-muted">
                      THEMACHINE · Dashboard Builder
                    </p>
                    <h2 className="mt-0.5 text-[18px] font-semibold tracking-tight text-text-primary">
                      {suggestion.dashboardName}
                    </h2>
                    <p className="mt-1 text-[12px] text-text-tertiary">
                      سناریو: {suggestion.scenarioName} ·{" "}
                      {toPersianDigits(suggestion.widgetCount)} ویجت از گفتگو
                      ساخته شده
                    </p>
                  </div>
                </div>
                {!isGenerating && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-text-tertiary transition-colors hover:bg-bg-subtle/80 hover:text-text-secondary"
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
                  <DashboardGenerationAnimation
                    suggestion={suggestion}
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
                      داشبورد از زمینه گفتگو تولید شده — بدون پیکربندی دستی.
                      پیش‌نمایش زنده را بررسی کنید و تأیید کنید.
                    </p>
                  </div>

                  <p className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-text-muted">
                    پیش‌نمایش زنده
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {suggestion.widgets.map((widget, i) => (
                      <motion.div
                        key={widget.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + i * 0.05, ...spring.soft }}
                        className={cn(
                          "rounded-[14px] border border-border bg-bg-layer-1 p-3.5",
                          i === 0 && "sm:col-span-2"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-text-muted">
                              {widget.label}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-[24px] font-bold tabular-nums leading-none tracking-tight",
                                toneStyles[widget.tone ?? "default"]
                              )}
                            >
                              {widget.value}
                            </p>
                            {widget.delta && (
                              <p className="mt-1.5 text-[11px] text-text-tertiary">
                                {widget.delta}
                              </p>
                            )}
                          </div>
                          {widget.sparkline && widget.sparkline.length > 1 && (
                            <div className="w-24 shrink-0 pt-1">
                              <MiniSparkline
                                points={widget.sparkline}
                                tone={widget.tone}
                              />
                            </div>
                          )}
                        </div>
                        {widget.description && (
                          <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
                            {widget.description}
                          </p>
                        )}
                      </motion.div>
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
                    <LayoutDashboard size={15} strokeWidth={1.75} />
                    تأیید و ایجاد داشبورد
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
