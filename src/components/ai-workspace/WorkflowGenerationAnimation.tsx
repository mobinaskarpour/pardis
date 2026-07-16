"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, LayoutDashboard, Sparkles } from "lucide-react";
import type { WorkflowGenerationPhase, WorkflowSuggestion } from "@/types/ai";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS: {
  phase: WorkflowGenerationPhase;
  icon: string;
  title: string;
}[] = [
  { phase: "analyzing", icon: "🧠", title: "تحلیل گفتگوها..." },
  { phase: "building", icon: "⚙️", title: "ساخت Workflow..." },
  { phase: "connecting", icon: "🔗", title: "اتصال سیستم‌ها..." },
  { phase: "dashboard", icon: "📊", title: "ایجاد داشبورد..." },
];

interface WorkflowGenerationAnimationProps {
  suggestion: WorkflowSuggestion;
  phase: WorkflowGenerationPhase;
}

export function WorkflowGenerationAnimation({
  suggestion,
  phase,
}: WorkflowGenerationAnimationProps) {
  const activeIndex = STEPS.findIndex((s) => s.phase === phase);
  const active = STEPS[activeIndex] ?? STEPS[0]!;

  return (
    <div className="p-3.5">
      <div className="flex items-center gap-2.5">
        <motion.span
          key={phase}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[20px]"
          aria-hidden
        >
          {active.icon}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-text-primary">{active.title}</p>
          <p className="text-[10px] text-text-muted truncate">{suggestion.workflowName}</p>
        </div>
      </div>

      <div className="mt-2.5 h-1 rounded-full bg-bg-subtle overflow-hidden">
        <motion.div
          className="h-full bg-accent-indigo rounded-full"
          animate={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2.5 min-h-[28px]"
        >
          {phase === "analyzing" && (
            <p className="text-[10px] text-text-muted flex items-center gap-1">
              <Sparkles size={10} className="text-accent-indigo" />
              {suggestion.repeatCount} گفتگوی مشابه
            </p>
          )}
          {phase === "building" && (
            <div className="flex flex-wrap gap-1">
              {["شروع", "PACS", "AI QC", "تأیید"].map((node, i) => (
                <motion.span
                  key={node}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12, ...spring.soft }}
                  className="rounded-[6px] border border-primary/20 bg-primary/8 px-1.5 py-0.5 text-[9px] font-semibold text-primary"
                >
                  {node}
                </motion.span>
              ))}
            </div>
          )}
          {phase === "connecting" && (
            <div className="flex flex-wrap gap-1">
              {suggestion.connectedSystems.slice(0, 3).map((sys, i) => (
                <motion.span
                  key={sys}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="inline-flex items-center gap-0.5 rounded-[6px] border border-border/50 bg-bg-elevated px-1.5 py-0.5 text-[9px] text-text-secondary"
                >
                  <Check size={8} className="text-success" />
                  {sys}
                </motion.span>
              ))}
            </div>
          )}
          {phase === "dashboard" && (
            <div className="flex flex-wrap gap-1">
              {suggestion.dashboardWidgets.slice(0, 2).map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="inline-flex items-center gap-0.5 rounded-[6px] border border-border/50 bg-bg-elevated px-1.5 py-0.5 text-[9px] font-medium text-text-primary"
                >
                  <LayoutDashboard size={8} className="text-primary/70" />
                  {name}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-2 flex gap-1">
        {STEPS.map((step, i) => (
          <div
            key={step.phase}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              i <= activeIndex ? "bg-accent-indigo" : "bg-bg-subtle"
            )}
          />
        ))}
      </div>
    </div>
  );
}
