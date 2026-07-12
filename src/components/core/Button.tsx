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
    "bg-primary text-white border-primary hover:border-primary-muted shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  ghost:
    "bg-transparent text-text-secondary border-border hover:text-text-primary",
  subtle:
    "bg-bg-elevated text-text-primary border-border",
  ai: "bg-bg-elevated text-primary border-border-hover",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[13px] gap-1.5 min-h-[32px]",
  md: "px-4 py-2 text-[15px] gap-2 min-h-[40px]",
  lg: "px-5 py-2.5 text-[16px] gap-2 min-h-[44px]",
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
        "transition-[border-color,box-shadow,transform,opacity] duration-[180ms]",
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
