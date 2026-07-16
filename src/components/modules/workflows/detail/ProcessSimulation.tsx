"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

interface ProcessSimulationProps {
  steps: string[];
  activeStep: number;
  onAdvance: () => void;
  onReset: () => void;
}

export function ProcessSimulation({
  steps,
  activeStep,
  onAdvance,
  onReset,
}: ProcessSimulationProps) {
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="rounded-[28px] border border-border/30 bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Live Simulation
          </p>
          <p className="mt-1 text-[15px] font-semibold text-text-primary">
            پیش‌نمایش اجرای زنده
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            <RotateCcw size={13} />
            از نو
          </button>
          <button
            type="button"
            onClick={onAdvance}
            disabled={activeStep >= steps.length - 1}
            className="inline-flex items-center gap-2 rounded-full bg-[#111318] px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-[#1a1d24] disabled:opacity-40 transition-colors"
          >
            <Play size={13} />
            گام بعد
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="h-1 rounded-full bg-bg-subtle overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="mt-3 text-[13px] text-text-muted tabular-nums">
          {toPersianDigits(activeStep + 1)} / {toPersianDigits(steps.length)}
        </p>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            animate={{
              opacity: i <= activeStep ? 1 : 0.35,
              x: i === activeStep ? 0 : 0,
            }}
            className={cn(
              "flex items-center gap-4 rounded-[14px] px-4 py-3 transition-colors",
              i === activeStep && "bg-primary/[0.06] ring-1 ring-primary/15",
              i < activeStep && "opacity-60"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums",
                i <= activeStep
                  ? "bg-primary text-white"
                  : "bg-bg-subtle text-text-muted"
              )}
            >
              {toPersianDigits(i + 1)}
            </span>
            <span
              className={cn(
                "text-[14px] leading-snug",
                i === activeStep
                  ? "font-semibold text-text-primary"
                  : "text-text-secondary"
              )}
            >
              {step}
            </span>
            {i === activeStep && (
              <span className="ms-auto flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
