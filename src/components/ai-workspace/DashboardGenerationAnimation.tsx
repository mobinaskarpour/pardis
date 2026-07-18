"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, LayoutDashboard, Sparkles } from "lucide-react";
import type {
  DashboardGenerationPhase,
  DashboardSuggestion,
} from "@/types/ai";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

const STEPS: {
  phase: DashboardGenerationPhase;
  icon: string;
  title: string;
}[] = [
  { phase: "analyzing", icon: "🧠", title: "در حال تحلیل گفتگو..." },
  { phase: "selecting", icon: "🧩", title: "در حال انتخاب ویجت‌ها..." },
  { phase: "building", icon: "📊", title: "در حال ساخت داشبورد..." },
];

interface DashboardGenerationAnimationProps {
  suggestion: DashboardSuggestion;
  phase: DashboardGenerationPhase;
}

export function DashboardGenerationAnimation({
  suggestion,
  phase,
}: DashboardGenerationAnimationProps) {
  const activeIndex = STEPS.findIndex((s) => s.phase === phase);
  const active = STEPS[activeIndex] ?? STEPS[0]!;

  return (
    <div className="p-4">
      <div className="flex items-center gap-2.5">
        <motion.span
          key={phase}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[22px]"
          aria-hidden
        >
          {active.icon}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-text-primary">
            {active.title}
          </p>
          <p className="text-[11px] text-text-muted truncate">
            {suggestion.dashboardName}
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
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
          className="mt-3 min-h-[36px]"
        >
          {phase === "analyzing" && (
            <p className="text-[11px] text-text-muted flex items-center gap-1.5">
              <Sparkles size={11} className="text-accent-indigo" />
              سناریو: {suggestion.scenarioName}
            </p>
          )}
          {phase === "selecting" && (
            <div className="flex flex-wrap gap-1.5">
              {suggestion.widgets.slice(0, 4).map((w, i) => (
                <motion.span
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, ...spring.soft }}
                  className="rounded-[6px] border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary"
                >
                  {w.label}
                </motion.span>
              ))}
            </div>
          )}
          {phase === "building" && (
            <div className="flex flex-wrap gap-1.5">
              {suggestion.widgets.map((w, i) => (
                <motion.span
                  key={w.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-border/50 bg-bg-elevated px-2 py-0.5 text-[10px] text-text-secondary"
                >
                  <Check size={9} className="text-success" />
                  {w.label}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex gap-1">
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

      <p className="mt-2 text-center text-[10px] text-text-muted">
        {toPersianDigits(suggestion.widgetCount)} ویجت در حال آماده‌سازی
      </p>
    </div>
  );
}
