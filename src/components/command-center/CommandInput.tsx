"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles, Zap } from "lucide-react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CommandSuggestion } from "@/mock/data/command-suggestions";
import { commandCategories } from "@/mock/data/command-suggestions";

interface CommandInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  suggestions?: CommandSuggestion[];
  autoFocus?: boolean;
}

const categoryAccent: Record<string, string> = {
  clinical: "hover:border-primary/30 hover:bg-primary/5",
  imaging: "hover:border-accent-cyan/30 hover:bg-accent-cyan/5",
  ai: "hover:border-accent-indigo/30 hover:bg-accent-indigo/5",
  operations: "hover:border-accent-warm/30 hover:bg-accent-warm/5",
  financial: "hover:border-success/30 hover:bg-success/5",
};

export function CommandInput({
  onSubmit,
  disabled,
  suggestions = [],
  autoFocus = true,
}: CommandInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }, [value, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const filtered = activeCategory
    ? suggestions.filter((s) => s.category === activeCategory)
    : suggestions;

  const usedCategories = commandCategories.filter((c) =>
    suggestions.some((s) => s.category === c.id)
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        animate={{
          boxShadow: focused
            ? "var(--shadow-lg), 0 0 0 3px var(--primary-soft)"
            : "var(--shadow-md)",
        }}
        transition={spring.soft}
        className={cn(
          "relative rounded-[var(--radius-2xl)] overflow-hidden",
          "bg-bg-elevated/90 border border-border-strong",
          "shadow-[var(--shadow-lg)]",
          "transition-all duration-[200ms]",
          focused && "ring-2 ring-primary/20 border-primary/20"
        )}
      >
        <div className="flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-primary/10">
            <Sparkles size={18} strokeWidth={1.75} className="text-primary" />
          </div>

          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="از ماشین بپرس..."
            rows={1}
            disabled={disabled}
            className={cn(
              "flex-1 resize-none bg-transparent",
              "text-[var(--text-body-lg)] text-text-primary placeholder:text-text-muted",
              "outline-none leading-relaxed",
              "disabled:opacity-50"
            )}
            style={{ minHeight: 28 }}
          />

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            whileHover={{ scale: 1.05, transition: spring.gentle }}
            whileTap={{ scale: 0.95, transition: spring.snappy }}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
              "transition-all duration-[200ms]",
              value.trim() && !disabled
                ? "bg-primary text-white shadow-[var(--shadow-sm)]"
                : "bg-bg-subtle text-text-muted cursor-not-allowed"
            )}
            aria-label="ارسال"
          >
            <ArrowUp size={18} strokeWidth={2} />
          </motion.button>
        </div>
      </motion.div>

      {suggestions.length > 0 && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...spring.soft }}
          className="mt-5"
        >
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium transition-all cursor-pointer",
                activeCategory === null
                  ? "bg-primary/12 text-primary"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-subtle/80"
              )}
            >
              همه
            </button>
            {usedCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? null : cat.id)
                }
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium transition-all cursor-pointer",
                  activeCategory === cat.id
                    ? "bg-primary/12 text-primary"
                    : "text-text-muted hover:text-text-secondary hover:bg-bg-subtle/80"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2 max-h-[140px] overflow-y-auto scrollbar-none px-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSubmit(s.query)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full glass-subtle px-3.5 py-2",
                  "text-[var(--text-sm)] text-text-secondary border border-transparent",
                  "transition-all duration-[140ms]",
                  "hover:text-text-primary hover:shadow-[var(--shadow-sm)]",
                  "cursor-pointer",
                  categoryAccent[s.category]
                )}
              >
                {s.urgent && (
                  <Zap size={12} className="text-warning shrink-0" />
                )}
                <span>{s.label}</span>
                {s.specialty && (
                  <span className="text-[10px] text-text-muted hidden sm:inline">
                    · {s.specialty}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
