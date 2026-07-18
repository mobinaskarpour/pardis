"use client";

import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { spring } from "@/lib/motion";

interface AIGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function AIGenerateModal({
  open,
  onClose,
  onGenerate,
  isGenerating,
}: AIGenerateModalProps) {
  if (!open) return null;

  const defaultPrompt =
    "وقتی گزارش MRI آماده شد، برای بیمار پیامک ارسال کن و نسخه PDF را ایمیل کن.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111318]/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={spring.panel}
        className="w-full max-w-lg rounded-[24px] border border-border/80 bg-bg-elevated shadow-[var(--shadow-float)] p-6 mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-accent-indigo/10">
              <Sparkles size={20} className="text-accent-indigo" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-text-primary">
                ساخت Workflow با AI
              </h2>
              <p className="text-[12px] text-text-muted">
                THEMACHINE گردش‌کار را می‌سازد
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          id="ai-prompt"
          defaultValue={defaultPrompt}
          rows={4}
          disabled={isGenerating}
          className="w-full rounded-[14px] border border-border bg-bg-subtle/40 px-4 py-3 text-[14px] leading-relaxed resize-none focus:outline-none focus:border-accent-indigo/30 disabled:opacity-60"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="rounded-[12px] px-4 py-2 text-[13px] text-text-secondary hover:bg-bg-subtle cursor-pointer disabled:opacity-50"
          >
            انصراف
          </button>
          <motion.button
            type="button"
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const el = document.getElementById("ai-prompt") as HTMLTextAreaElement;
              onGenerate(el?.value ?? defaultPrompt);
            }}
            className="rounded-[12px] bg-accent-indigo px-5 py-2 text-[13px] font-medium text-white cursor-pointer hover:bg-accent-indigo/90 disabled:opacity-60"
          >
            {isGenerating ? "در حال ساخت..." : "✨ بساز"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
