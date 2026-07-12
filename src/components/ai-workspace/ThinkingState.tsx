"use client";

import { useState, useEffect } from "react";
import { AIThinking as CoreAIThinking } from "@/components/core";

interface ThinkingStateProps {
  active: boolean;
  onComplete?: () => void;
}

const persianSteps = [
  "AI در حال تحلیل...",
  "جمع‌آوری اطلاعات...",
  "بررسی پرونده‌ها...",
  "ساخت پاسخ...",
  "آماده شد.",
];

export function ThinkingState({ active, onComplete }: ThinkingStateProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) setDone(false);
  }, [active]);

  if (done) return null;

  return (
    <CoreAIThinking
      active={active}
      steps={persianSteps}
      compact
      onComplete={() => {
        setDone(true);
        onComplete?.();
      }}
    />
  );
}
