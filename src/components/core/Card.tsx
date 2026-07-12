"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, interactive, radius, cardHover, cardTap } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";

export type CardVariant =
  | "default"
  | "ai"
  | "insight"
  | "patient"
  | "doctor"
  | "report"
  | "alert"
  | "medical"
  | "finance"
  | "workflow"
  | "status"
  | "timeline"
  | "prediction";

interface CardProps {
  variant?: CardVariant;
  hero?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: "border-border bg-bg-elevated",
  ai: "border-border-hover bg-bg-elevated/80 backdrop-blur-sm",
  insight: "border-accent-indigo/20 bg-accent-indigo/5",
  patient: "border-border bg-bg-elevated",
  doctor: "border-border bg-bg-elevated",
  report: "border-border bg-bg-elevated",
  alert: "border-warning/25 bg-warning/5",
  medical: "border-accent-cyan/20 bg-bg-elevated",
  finance: "border-primary/15 bg-bg-elevated",
  workflow: "border-accent-indigo/15 bg-bg-elevated",
  status: "border-border bg-bg-subtle/50",
  timeline: "border-border bg-bg-elevated/60",
  prediction: "border-primary/20 bg-primary/5",
};

const paddingMap = {
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  hero,
  subtitle,
  action,
  padding = "md",
  hover = true,
  className,
  children,
  onClick,
}: CardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      whileHover={hover && !reduced ? cardHover : undefined}
      whileTap={!reduced ? cardTap : undefined}
      onClick={onClick}
      className={cn(
        "border transition-all duration-[180ms]",
        radius.lg,
        variantStyles[variant],
        hover && interactive.hover,
        paddingMap[padding],
        className
      )}
    >
      {(hero || subtitle || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {hero && (
              <div className="text-[15px] font-semibold text-text-primary leading-snug">
                {hero}
              </div>
            )}
            {subtitle && (
              <p className="mt-1 text-[13px] text-text-tertiary">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </motion.article>
  );
}
