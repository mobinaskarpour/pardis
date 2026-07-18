"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { WorkflowSuggestion } from "@/types/ai";
import { spring } from "@/lib/motion";
import { WorkflowSuggestionCard } from "./WorkflowSuggestionCard";

interface WorkflowSuggestionNotificationProps {
  suggestion: WorkflowSuggestion | null | undefined;
  onAccept: () => void;
  onDismiss: () => void;
}

export function WorkflowSuggestionNotification({
  suggestion,
  onAccept,
  onDismiss,
}: WorkflowSuggestionNotificationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !suggestion || suggestion.status === "dismissed") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={suggestion.workflowId + suggestion.status}
        initial={{ opacity: 0, x: -28, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.98 }}
        transition={{ duration: 0.38, ...spring.soft }}
        className="fixed top-20 end-4 z-[80] w-[min(340px,calc(100vw-2rem))] md:end-6"
      >
        <div className="mb-1.5 flex items-center gap-1.5 px-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-indigo/40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-indigo" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-indigo/80">
            THEMACHINE
          </span>
        </div>
        <WorkflowSuggestionCard
          variant="notification"
          suggestion={suggestion}
          onAccept={onAccept}
          onDismiss={onDismiss}
        />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
