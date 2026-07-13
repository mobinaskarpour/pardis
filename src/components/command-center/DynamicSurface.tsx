"use client";

import { motion } from "framer-motion";
import { AIThinking } from "@/components/core/AIThinking";
import { AICanvas } from "@/components/ai-workspace/canvas/AICanvas";
import type { CanvasType } from "@/lib/ai-workspace-data";
import { spring } from "@/lib/motion";

interface DynamicSurfaceProps {
  mode: "idle" | "thinking" | "active";
  canvas: CanvasType;
  response: string | null;
  query: string | null;
  thinking: boolean;
  onThinkingComplete: () => void;
  onSuggestionClick: (s: string) => void;
}

export function DynamicSurface({
  mode,
  canvas,
  response,
  query,
  thinking,
  onThinkingComplete,
  onSuggestionClick,
}: DynamicSurfaceProps) {
  if (mode === "idle") return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={spring.hero}
      className="mt-12"
    >
      {query && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[var(--text-sm)] text-text-muted mb-4 text-center"
        >
          «{query}»
        </motion.p>
      )}

      {thinking && (
        <div className="flex flex-col items-center py-8">
          <AIThinking
            active
            steps={[
              "در حال تحلیل درخواست...",
              "جستجو در پرونده‌ها...",
              "آماده‌سازی رابط...",
            ]}
            onComplete={onThinkingComplete}
          />
        </div>
      )}

      {!thinking && mode === "active" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="rounded-[var(--radius-2xl)] glass overflow-hidden"
        >
          {response && (
            <div className="border-b border-border px-6 py-4">
              <p className="text-[var(--text-body-lg)] text-text-primary leading-relaxed">
                {response}
              </p>
            </div>
          )}

          <div className="p-6 md:p-8">
            <AICanvas canvas={canvas} onSuggestionClick={onSuggestionClick} />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
