"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { radius } from "@/lib/motion";

const defaultSteps = [
  "Searching...",
  "Connecting...",
  "Analyzing...",
  "Generating...",
  "Reasoning...",
];

interface AIThinkingProps {
  active?: boolean;
  steps?: string[];
  onComplete?: () => void;
  className?: string;
  compact?: boolean;
}

export function AIThinking({
  active = true,
  steps = defaultSteps,
  onComplete,
  className,
  compact = false,
}: AIThinkingProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 300);
          return prev;
        }
        return prev + 1;
      });
    }, 650);

    return () => clearInterval(interval);
  }, [active, steps, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
          transition={spring.soft}
          className={cn(
            "flex items-center gap-3 border border-border bg-bg-elevated/80 backdrop-blur-sm",
            radius.md,
            compact ? "px-3 py-2" : "px-4 py-2.5",
            className
          )}
          aria-live="polite"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent-indigo"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
              transition={spring.gentle}
              className="text-[13px] text-text-secondary"
            >
              {steps[index]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
