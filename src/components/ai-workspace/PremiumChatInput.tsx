"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ImagePlus,
  Mic,
  Paperclip,
  Sparkles,
} from "lucide-react";
import { spring } from "@/lib/motion";
import { chatGreeting } from "@/mock/data/chat-experience";
import { QuickCommands } from "./QuickCommands";
import { cn } from "@/lib/utils";

interface PremiumChatInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  showQuickCommands?: boolean;
  large?: boolean;
  onVoiceOpen?: () => void;
}

export function PremiumChatInput({
  onSubmit,
  disabled,
  showQuickCommands = true,
  large = false,
  onVoiceOpen,
}: PremiumChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (large) inputRef.current?.focus();
  }, [large]);

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

  return (
    <div className="w-full max-w-3xl mx-auto">
      {showQuickCommands && (
        <QuickCommands onSelect={onSubmit} disabled={disabled} />
      )}

      <motion.div
        animate={{
          boxShadow: focused
            ? "var(--shadow-md), 0 0 0 3px var(--primary-soft)"
            : "var(--shadow-sm)",
        }}
        transition={spring.soft}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          setValue((v) => v + (v ? "\n" : "") + "[فایل پیوست شد]");
        }}
        className={cn(
          "relative rounded-[16px] overflow-hidden border bg-bg-elevated transition-colors",
          dragOver ? "border-primary/40 bg-primary/[0.02]" : "border-border",
          large ? "min-h-[112px]" : ""
        )}
      >
        <div className="flex items-start gap-3 p-4 md:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/10">
            <Sparkles size={18} className="text-primary" strokeWidth={1.75} />
          </div>

          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={chatGreeting.placeholder}
            rows={large ? 3 : 2}
            disabled={disabled}
            className={cn(
              "flex-1 resize-none bg-transparent outline-none leading-relaxed",
              "text-[15px] text-text-primary placeholder:text-text-muted/80",
              "disabled:opacity-50 min-h-[56px]"
            )}
          />

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] transition-all",
              value.trim() && !disabled
                ? "bg-primary text-white shadow-[0_4px_12px_rgba(45,90,123,0.3)]"
                : "bg-bg-subtle text-text-muted"
            )}
            aria-label="ارسال"
          >
            <ArrowUp size={18} strokeWidth={2} />
          </motion.button>
        </div>

        <div className="flex items-center gap-1 border-t border-border/50 px-4 py-2.5 bg-bg-layer-1/80">
          <button
            type="button"
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[11px] text-text-muted hover:text-text-secondary hover:bg-bg-subtle transition-colors disabled:opacity-40"
          >
            <Paperclip size={14} strokeWidth={1.75} />
            پیوست
          </button>
          <button
            type="button"
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[11px] text-text-muted hover:text-text-secondary hover:bg-bg-subtle transition-colors disabled:opacity-40"
          >
            <ImagePlus size={14} strokeWidth={1.75} />
            تصویر
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onVoiceOpen}
            className={cn(
              "flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[11px] transition-colors disabled:opacity-40",
              "text-primary hover:bg-primary/8 font-medium"
            )}
            aria-label="دستیار صوتی"
          >
            <Mic size={14} strokeWidth={1.75} />
            صدا
          </button>
          <span className="ms-auto text-[10px] text-text-tertiary">
            خط جدید با Shift و Enter
          </span>
        </div>
      </motion.div>
    </div>
  );
}
