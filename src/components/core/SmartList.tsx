"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { spring, radius } from "@/lib/motion";

export interface SmartListItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  aiSummary?: string;
  status?: React.ReactNode;
  action?: React.ReactNode;
}

interface SmartListProps {
  items: SmartListItem[];
  onItemClick?: (id: string) => void;
  className?: string;
}

export function SmartList({ items, onItemClick, className }: SmartListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: i * 0.05, ...spring.gentle }}
          whileHover={{ x: -2, transition: spring.gentle }}
          role={onItemClick ? "button" : undefined}
          tabIndex={onItemClick ? 0 : undefined}
          onClick={() => onItemClick?.(item.id)}
          onKeyDown={(e) => e.key === "Enter" && onItemClick?.(item.id)}
          className={cn(
            "group relative rounded-[14px] border border-border bg-bg-elevated p-4",
            "transition-all duration-[180ms] hover:border-border-hover hover:shadow-[var(--shadow-sm)]",
            onItemClick && "cursor-pointer"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-medium text-text-primary truncate">
                  {item.title}
                </p>
                {item.status}
              </div>
              {item.subtitle && (
                <p className="mt-0.5 text-[13px] text-text-tertiary truncate">
                  {item.subtitle}
                </p>
              )}
              {item.meta && (
                <p className="mt-1 text-[13px] text-text-secondary">{item.meta}</p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[120ms]">
              {item.action}
              <button
                type="button"
                className={cn(
                  "flex h-7 w-7 items-center justify-center text-text-tertiary",
                  "hover:text-text-secondary cursor-pointer",
                  radius.sm
                )}
                aria-label="گزینه‌های بیشتر"
              >
                <MoreHorizontal size={14} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {item.aiSummary && (
            <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-[180ms] group-hover:max-h-16 group-hover:opacity-100 border-t border-border pt-3">
              <div className="flex items-start gap-2">
                <Sparkles size={12} className="text-accent-indigo shrink-0 mt-0.5" />
                <p className="text-[13px] text-text-secondary leading-snug">
                  {item.aiSummary}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
