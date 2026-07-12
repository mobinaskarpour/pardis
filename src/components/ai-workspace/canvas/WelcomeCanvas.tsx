"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { spring } from "@/lib/motion";
import { pageLabels } from "@/config/labels";
import { emptySuggestions } from "@/lib/ai-workspace-data";

interface WelcomeCanvasProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function WelcomeCanvas({ onSuggestionClick }: WelcomeCanvasProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={spring.soft}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg-elevated mb-6">
        <Sparkles size={24} strokeWidth={1.75} className="text-primary" />
      </div>

      <h2 className="text-[28px] font-semibold text-text-primary">
        {pageLabels.chat}
      </h2>
      <p className="mt-3 max-w-md text-[15px] text-text-secondary leading-relaxed">
        با سیستم صحبت کنید. AI می‌تواند پرونده باز کند، گزارش بسازد،
        Workflow ایجاد کند و رابط را تغییر دهد.
      </p>

      <div className="mt-10 w-full max-w-lg">
        <p className="text-[13px] font-medium text-text-tertiary mb-3">
          پیشنهاد AI
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {emptySuggestions.map((suggestion, i) => (
            <motion.button
              key={suggestion}
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, ...spring.gentle }}
              whileHover={{ y: -2, transition: spring.gentle }}
              onClick={() => onSuggestionClick(suggestion)}
              className="rounded-[10px] border border-border bg-bg-elevated px-4 py-2 text-[13px] text-text-secondary transition-colors duration-[120ms] hover:border-border-hover hover:text-text-primary cursor-pointer"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
