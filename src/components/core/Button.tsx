"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, radius, cardHover, cardTap, interactive } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";

export type ButtonVariant = "primary" | "ghost" | "subtle" | "ai";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border-transparent shadow-[var(--shadow-sm)] hover:bg-primary-muted hover:shadow-[var(--shadow-md)]",
  ghost:
    "bg-transparent text-text-secondary border-transparent hover:bg-bg-subtle hover:text-text-primary",
  subtle:
    "bg-bg-elevated text-text-primary border-border hover:border-border-strong hover:shadow-[var(--shadow-sm)]",
  ai: "bg-primary-soft text-primary border-border-hover hover:bg-primary/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[12px] gap-1.5 min-h-[32px]",
  md: "px-4 py-2 text-[13px] gap-2 min-h-[38px]",
  lg: "px-5 py-2.5 text-[14px] gap-2 min-h-[44px]",
};

export function Button({
  variant = "subtle",
  size = "md",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      whileHover={disabled || reduced ? undefined : cardHover}
      whileTap={disabled || reduced ? undefined : cardTap}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium border cursor-pointer",
        radius.md,
        interactive.focus,
        interactive.disabled,
        "transition-[background-color,border-color,box-shadow,color,transform] duration-[160ms]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** @deprecated Use Button — kept for backward compatibility */
export const PremiumButton = Button;
