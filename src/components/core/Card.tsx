"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { interactive, radius, cardHover, cardTap } from "@/lib/motion";
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
  default: "border-border bg-bg-elevated shadow-[var(--shadow-sm)]",
  ai: "border-primary/15 bg-bg-elevated shadow-[var(--shadow-sm)] ring-1 ring-primary/5",
  insight: "border-accent-indigo/15 bg-accent-indigo/[0.04] shadow-[var(--shadow-sm)]",
  patient: "border-border bg-bg-elevated shadow-[var(--shadow-sm)]",
  doctor: "border-border bg-bg-elevated shadow-[var(--shadow-sm)]",
  report: "border-border bg-bg-elevated shadow-[var(--shadow-sm)]",
  alert: "border-warning/20 bg-warning/[0.04] shadow-[var(--shadow-sm)]",
  medical: "border-accent-cyan/20 bg-bg-elevated shadow-[var(--shadow-sm)]",
  finance: "border-primary/12 bg-bg-elevated shadow-[var(--shadow-sm)]",
  workflow: "border-accent-indigo/12 bg-bg-elevated shadow-[var(--shadow-sm)]",
  status: "border-border bg-bg-subtle/60 shadow-none",
  timeline: "border-border bg-bg-elevated/80 shadow-none",
  prediction: "border-primary/15 bg-primary/[0.03] shadow-[var(--shadow-sm)]",
};

const paddingMap = {
  sm: "p-3.5",
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
      whileTap={onClick && !reduced ? cardTap : undefined}
      onClick={onClick}
      className={cn(
        "border transition-[border-color,box-shadow,transform] duration-[160ms]",
        radius.lg,
        variantStyles[variant],
        hover && "hover:border-border-hover hover:shadow-[var(--shadow-md)]",
        onClick && "cursor-pointer",
        interactive.focus,
        paddingMap[padding],
        className
      )}
    >
      {(hero || subtitle || action) && (
        <header className="mb-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {hero && (
              <div className="text-[14px] font-semibold text-text-primary leading-snug tracking-tight">
                {hero}
              </div>
            )}
            {subtitle && (
              <p className="mt-1 text-[12px] text-text-tertiary leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </motion.article>
  );
}
