"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { spring, interactive, radius } from "@/lib/motion";
import { uiLabels } from "@/config/labels";

interface AIButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

const iconSize = { sm: 16, md: 18, lg: 20 };

export function AIButton({
  href = "/chat",
  onClick,
  className,
  size = "lg",
  label = uiLabels.aiWorkspace,
}: AIButtonProps) {
  const content = (
    <motion.span
      whileHover={{ y: -2, transition: spring.gentle }}
      whileTap={{ scale: 0.98, transition: spring.snappy }}
      className={cn(
        "relative flex items-center justify-center",
        sizeMap[size],
        radius.md,
        "border border-border-hover bg-bg-elevated text-primary",
        "shadow-[var(--shadow-md)] cursor-pointer",
        interactive.focus,
        className
      )}
    >
      {/* Calm pulse ring */}
      <motion.span
        className="absolute inset-0 border border-primary/20"
        style={{ borderRadius: "inherit" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ type: "tween", duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <Sparkles size={iconSize[size]} strokeWidth={1.75} />
    </motion.span>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={label} className="inline-flex">
        {content}
      </button>
    );
  }

  return (
    <Link href={href} aria-label={label} className="inline-flex fixed bottom-8 left-8 z-40">
      {content}
    </Link>
  );
}
