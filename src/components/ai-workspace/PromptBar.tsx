"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Paperclip, ArrowUp } from "lucide-react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PromptBarProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function PromptBar({ onSubmit, disabled }: PromptBarProps) {
  const [value, setValue] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
    inputRef.current?.focus();
  }, [value, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "border-t border-border bg-bg-elevated/80 backdrop-blur-sm p-4 transition-colors duration-[180ms]",
        dragOver && "bg-primary/5 border-primary/20"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
    >
      {dragOver && (
        <p className="text-center text-[13px] text-primary mb-2">
          فایل را اینجا رها کنید
        </p>
      )}

      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <motion.button
          type="button"
          whileHover={{ y: -2, transition: spring.gentle }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border text-text-tertiary transition-colors duration-[120ms] hover:border-border-hover hover:text-text-secondary cursor-pointer"
          aria-label="پیوست فایل"
        >
          <Paperclip size={18} strokeWidth={1.75} />
        </motion.button>

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="امروز می‌خواهید چه چیزی بدانید؟"
            rows={1}
            disabled={disabled}
            className={cn(
              "w-full resize-none rounded-[10px] border border-border bg-bg px-4 py-2.5",
              "text-[15px] text-text-primary placeholder:text-text-tertiary",
              "outline-none transition-colors duration-[120ms]",
              "focus:border-border-hover",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "max-h-32"
            )}
            style={{ minHeight: 42 }}
          />
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -2, transition: spring.gentle }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border text-text-tertiary transition-colors duration-[120ms] hover:border-border-hover hover:text-text-secondary cursor-pointer"
          aria-label="ورودی صوتی"
        >
          <Mic size={18} strokeWidth={1.75} />
        </motion.button>

        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          whileHover={{ y: -2, transition: spring.gentle }}
          whileTap={{ scale: 0.95, transition: spring.snappy }}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
            "transition-colors duration-[120ms] cursor-pointer",
            value.trim() && !disabled
              ? "bg-primary text-white border border-primary"
              : "border border-border text-text-tertiary opacity-50 cursor-not-allowed"
          )}
          aria-label="ارسال"
        >
          <ArrowUp size={18} strokeWidth={1.75} />
        </motion.button>
      </div>
    </div>
  );
}
