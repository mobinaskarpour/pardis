"use client";

import { motion } from "framer-motion";
import {
  Circle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { spring, radius } from "@/lib/motion";

export type StatusTone = "success" | "warning" | "error" | "info" | "neutral" | "ai";

interface StatusProps {
  label: string;
  tone?: StatusTone;
  pulse?: boolean;
  icon?: LucideIcon;
  className?: string;
}

const toneConfig: Record<
  StatusTone,
  { bg: string; text: string; dot: string; Icon: LucideIcon }
> = {
  success: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    Icon: CheckCircle2,
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    Icon: AlertCircle,
  },
  error: {
    bg: "bg-error/10",
    text: "text-error",
    dot: "bg-error",
    Icon: AlertCircle,
  },
  info: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    Icon: Circle,
  },
  neutral: {
    bg: "bg-bg-subtle",
    text: "text-text-secondary",
    dot: "bg-text-tertiary",
    Icon: Clock,
  },
  ai: {
    bg: "bg-accent-indigo/10",
    text: "text-accent-indigo",
    dot: "bg-accent-indigo",
    Icon: Sparkles,
  },
};

export function Status({
  label,
  tone = "neutral",
  pulse = false,
  icon,
  className,
}: StatusProps) {
  const config = toneConfig[tone];
  const Icon = icon ?? config.Icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={spring.gentle}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[13px] font-medium",
        radius.sm,
        config.bg,
        config.text,
        className
      )}
    >
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <Icon size={12} strokeWidth={1.75} />
        {pulse && (
          <motion.span
            className={cn("absolute inset-0 rounded-full opacity-40", config.dot)}
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </span>
      {label}
    </motion.span>
  );
}
