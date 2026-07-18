"use client";

import { Sparkles } from "lucide-react";
import { Button } from "./Button";
import { radius } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  suggestions?: string[];
  actions?: { label: string; onClick?: () => void; href?: string }[];
  onSuggestionClick?: (s: string) => void;
  className?: string;
}

export function EmptyState({
  title = "هنوز داده‌ای نیست",
  description = "از یکی از گزینه‌های زیر شروع کنید یا با THEMACHINE گفتگو کنید.",
  suggestions = [],
  actions = [],
  onSuggestionClick,
  className,
}: EmptyStateProps) {
  return (
    <Stagger
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6",
        radius.lg,
        "border border-border-strong bg-bg-elevated/90 shadow-[var(--shadow-sm)]",
        className
      )}
      staggerDelay={0.08}
    >
      <StaggerItem>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-border bg-bg-elevated shadow-[var(--shadow-sm)]">
          <Sparkles size={18} strokeWidth={1.75} className="text-primary/80" />
        </div>
      </StaggerItem>

      <StaggerItem>
        <h3 className="text-[16px] font-semibold tracking-tight text-text-primary">
          {title}
        </h3>
        <p className="mt-1.5 max-w-sm mx-auto text-[13px] text-text-secondary leading-relaxed">
          {description}
        </p>
      </StaggerItem>

      {suggestions.length > 0 && (
        <StaggerItem>
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestionClick?.(s)}
                className={cn(
                  radius.md,
                  "border border-border bg-bg-elevated px-3 py-1.5 text-[12px] text-text-secondary",
                  "shadow-[var(--shadow-sm)]",
                  "hover:border-border-hover hover:text-text-primary transition-colors duration-[120ms] cursor-pointer"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </StaggerItem>
      )}

      {actions.length > 0 && (
        <StaggerItem>
          <div className="mt-4 flex gap-2 justify-center">
            {actions.map((a) => (
              <Button key={a.label} size="sm" onClick={a.onClick}>
                {a.label}
              </Button>
            ))}
          </div>
        </StaggerItem>
      )}
    </Stagger>
  );
}
