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

/** Illustration → AI Suggestion → Button — staggered entrance */
export function EmptyState({
  title = "هنوز داده‌ای نیست",
  description = "AI پیشنهاد می‌کند از یکی از گزینه‌های زیر شروع کنید.",
  suggestions = [],
  actions = [],
  onSuggestionClick,
  className,
}: EmptyStateProps) {
  return (
    <Stagger
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        radius.lg,
        "border border-dashed border-border bg-bg-elevated/40",
        className
      )}
      staggerDelay={0.1}
    >
      <StaggerItem>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg-elevated mb-5 mx-auto">
          <Sparkles size={22} strokeWidth={1.75} className="text-primary/70" />
        </div>
      </StaggerItem>

      <StaggerItem>
        <h3 className="text-[18px] font-semibold text-text-primary">{title}</h3>
        <p className="mt-2 max-w-sm text-[15px] text-text-secondary mx-auto">{description}</p>
      </StaggerItem>

      {suggestions.length > 0 && (
        <StaggerItem>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestionClick?.(s)}
                className={cn(
                  radius.md,
                  "border border-border bg-bg-elevated px-3 py-1.5 text-[13px] text-text-secondary",
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
