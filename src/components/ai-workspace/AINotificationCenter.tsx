"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  FileText,
  LayoutDashboard,
  Timer,
  TriangleAlert,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import type {
  AISuggestion,
  AISuggestionType,
  DashboardQueueSuggestion,
  WorkflowQueueSuggestion,
} from "@/types/ai";
import { cn } from "@/lib/utils";
import { WorkflowGenerationAnimation } from "./WorkflowGenerationAnimation";
import { DashboardGenerationAnimation } from "./DashboardGenerationAnimation";

const TYPE_META: Record<
  AISuggestionType,
  { emoji: string; icon: typeof Zap; accent: string }
> = {
  workflow: {
    emoji: "⚡",
    icon: Zap,
    accent: "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20",
  },
  dashboard: {
    emoji: "📊",
    icon: LayoutDashboard,
    accent: "bg-primary/10 text-primary border-primary/20",
  },
  automation: {
    emoji: "🤖",
    icon: Workflow,
    accent: "bg-success/10 text-success border-success/20",
  },
  report: {
    emoji: "📄",
    icon: FileText,
    accent: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  },
  reminder: {
    emoji: "⏰",
    icon: Timer,
    accent: "bg-accent-warm/10 text-accent-warm border-accent-warm/25",
  },
  alert: {
    emoji: "⚠",
    icon: TriangleAlert,
    accent: "bg-warning/10 text-warning border-warning/25",
  },
};

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onPrimary: () => void;
  onDismiss: () => void;
}

function toLegacyWorkflow(s: WorkflowQueueSuggestion) {
  return {
    status: s.status === "preview" ? ("pending" as const) : s.status,
    reason: s.reason,
    workflowId: s.workflowId,
    workflowName: s.workflowName,
    dashboardName: s.dashboardName,
    dashboardWidgets: s.dashboardWidgets,
    connectedSystems: s.connectedSystems,
    triggerLabel: s.triggerLabel,
    actionLabels: s.actionLabels,
    repeatCount: s.repeatCount,
    generationPhase: s.generationPhase,
  };
}

function toLegacyDashboard(s: DashboardQueueSuggestion) {
  return {
    status: s.status,
    reason: s.reason,
    dashboardId: s.dashboardId,
    dashboardName: s.dashboardName,
    scenarioName: s.scenarioName,
    widgets: s.widgets,
    widgetCount: s.widgetCount,
    generationPhase: s.generationPhase,
  };
}

export function AISuggestionCard({
  suggestion,
  onPrimary,
  onDismiss,
}: AISuggestionCardProps) {
  if (suggestion.status === "dismissed") return null;

  const meta = TYPE_META[suggestion.type];
  const shell = cn(
    "relative w-full overflow-hidden rounded-[14px] border",
    "bg-bg-elevated/98 backdrop-blur-xl",
    "shadow-[0_12px_40px_rgba(15,23,42,0.10),0_2px_8px_rgba(91,95,199,0.08)]"
  );

  if (
    suggestion.type === "workflow" &&
    suggestion.status === "generating" &&
    suggestion.generationPhase
  ) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98, height: 0 }}
        transition={spring.soft}
        className={cn(shell, "border-primary/20")}
      >
        <WorkflowGenerationAnimation
          suggestion={toLegacyWorkflow(suggestion)}
          phase={suggestion.generationPhase}
        />
      </motion.div>
    );
  }

  if (
    suggestion.type === "dashboard" &&
    suggestion.status === "generating" &&
    suggestion.generationPhase
  ) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98, height: 0 }}
        transition={spring.soft}
        className={cn(shell, "border-primary/20")}
      >
        <DashboardGenerationAnimation
          suggestion={toLegacyDashboard(suggestion)}
          phase={suggestion.generationPhase}
        />
      </motion.div>
    );
  }

  if (suggestion.status === "accepted") {
    return (
      <motion.div
        layout
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
            <p className="text-[13px] font-bold text-text-primary">
              {suggestion.type === "workflow"
                ? "Workflow ایجاد شد"
                : suggestion.type === "dashboard"
                  ? "داشبورد ایجاد شد"
                  : "انجام شد"}
            </p>
            <p className="text-[11px] text-text-muted truncate">
              {suggestion.subtitle}
            </p>
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
      </motion.div>
    );
  }

  if (suggestion.status === "preview") return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.98 }}
      transition={{ duration: 0.28, ...spring.soft }}
      className={cn(shell, "border-accent-indigo/20")}
    >
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[15px] border",
              meta.accent
            )}
          >
            {meta.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-text-primary leading-tight">
                    {suggestion.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-text-secondary truncate">
                    {suggestion.subtitle}
                  </p>
                  {suggestion.description && (
                    <p className="mt-1.5 text-[10px] leading-relaxed text-text-muted">
                      {suggestion.description}
                    </p>
                  )}
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
          </div>
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <button
            type="button"
            onClick={onPrimary}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-[9px] bg-accent-indigo px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-95 active:scale-[0.98] transition-all"
          >
            {suggestion.primaryLabel}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-[9px] px-2.5 py-1.5 text-[10px] font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            {suggestion.secondaryLabel ?? "بعداً"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface AINotificationCenterProps {
  suggestions: AISuggestion[];
  onPrimary: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AINotificationCenter({
  suggestions,
  onPrimary,
  onDismiss,
}: AINotificationCenterProps) {
  // Keep stacked siblings visible: only hide the card currently in a builder
  // (preview/generating) or already dismissed — never clear the whole queue.
  const active = suggestions.filter(
    (s) =>
      s.status !== "dismissed" &&
      s.status !== "preview" &&
      s.status !== "generating"
  );

  if (active.length === 0) return null;

  return (
    <div className="fixed top-20 end-4 z-[80] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-2.5 md:end-6">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-1"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-indigo/40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-indigo" />
        </span>
        <Bell size={12} className="text-accent-indigo" strokeWidth={2} />
        <p className="text-[11px] font-bold text-text-primary">
          AI Suggestions ({toPersianDigits(active.length)})
        </p>
        <span className="ms-auto text-[9px] font-semibold uppercase tracking-wider text-accent-indigo/70">
          THEMACHINE
        </span>
      </motion.div>

      <div className="flex max-h-[min(70vh,560px)] flex-col gap-2.5 overflow-y-auto scrollbar-none pe-0.5">
        <AnimatePresence mode="popLayout">
          {active.map((suggestion) => (
            <AISuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onPrimary={() => onPrimary(suggestion.id)}
              onDismiss={() => onDismiss(suggestion.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
