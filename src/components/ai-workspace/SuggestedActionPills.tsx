"use client";

import { motion } from "framer-motion";
import { contextualSuggestedActions } from "@/mock/data/chat-experience";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SuggestedActionPillsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export function SuggestedActionPills({
  onSelect,
  disabled,
}: SuggestedActionPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 px-2 max-w-3xl mx-auto">
      {contextualSuggestedActions.map((action, i) => (
        <motion.button
          key={action.id}
          type="button"
          disabled={disabled}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + i * 0.04, ...spring.soft }}
          whileHover={{ y: -2, transition: spring.gentle }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(action.query)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2.5",
            "text-[13px] font-medium text-text-secondary",
            "bg-gradient-to-br shadow-sm transition-all duration-200",
            "hover:text-text-primary hover:shadow-md hover:border-primary/25",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            action.accent ?? "from-white to-white border-border/70"
          )}
        >
          <span className="text-[16px]" aria-hidden>
            {action.emoji}
          </span>
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
