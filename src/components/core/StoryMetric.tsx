"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, radius, cardHover } from "@/lib/motion";
import { CountUp, useReducedMotion } from "@/components/motion";

interface StoryMetricProps {
  label: string;
  value: string;
  numericValue?: number;
  valueSuffix?: string;
  story: string;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

/** Story-driven metric — NOT a classic KPI card */
export function StoryMetric({
  label,
  value,
  numericValue,
  valueSuffix = "",
  story,
  trend,
  className,
}: StoryMetricProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      whileHover={reduced ? undefined : cardHover}
      className={cn(
        "border border-border bg-bg-elevated p-5",
        radius.lg,
        "transition-all duration-[180ms] hover:border-border-hover hover:shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <p className="text-[13px] font-medium text-text-tertiary">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-[32px] font-semibold leading-none text-text-primary tabular-nums">
          {numericValue != null ? (
            <CountUp value={numericValue} suffix={valueSuffix} />
          ) : (
            value
          )}
        </span>
        {trend && (
          <span
            className={cn(
              "mb-1 text-[13px] rounded-[6px] px-1.5 py-0.5",
              trend.positive ? "bg-success/10 text-success" : "bg-error/10 text-error"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-3 text-[13px] text-text-secondary leading-relaxed">{story}</p>
    </motion.div>
  );
}
