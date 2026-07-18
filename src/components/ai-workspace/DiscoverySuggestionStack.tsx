"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { DashboardSuggestion, WorkflowSuggestion } from "@/types/ai";
import { spring } from "@/lib/motion";
import { WorkflowSuggestionCard } from "./WorkflowSuggestionCard";
import { DashboardSuggestionCard } from "./DashboardSuggestionCard";

interface DiscoverySuggestionStackProps {
  workflowSuggestion?: WorkflowSuggestion | null;
  dashboardSuggestion?: DashboardSuggestion | null;
  onWorkflowAccept: () => void;
  onWorkflowDismiss: () => void;
  onDashboardAccept: () => void;
  onDashboardDismiss: () => void;
}

/**
 * Shared placement for Workflow + Dashboard discovery cards.
 * Same position/animation as WorkflowSuggestionNotification — stacked when both active.
 * Does not modify WorkflowSuggestionCard / WorkflowSuggestionNotification.
 */
export function DiscoverySuggestionStack({
  workflowSuggestion,
  dashboardSuggestion,
  onWorkflowAccept,
  onWorkflowDismiss,
  onDashboardAccept,
  onDashboardDismiss,
}: DiscoverySuggestionStackProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showWorkflow =
    !!workflowSuggestion && workflowSuggestion.status !== "dismissed";
  const showDashboard =
    !!dashboardSuggestion &&
    dashboardSuggestion.status !== "dismissed" &&
    dashboardSuggestion.status !== "preview";

  if (!mounted || (!showWorkflow && !showDashboard)) {
    return null;
  }

  return createPortal(
    <div className="fixed top-20 end-4 z-[80] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-3 md:end-6">
      <AnimatePresence>
        {showWorkflow && workflowSuggestion && (
          <motion.div
            key={"wf-" + workflowSuggestion.workflowId + workflowSuggestion.status}
            initial={{ opacity: 0, x: -28, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.38, ...spring.soft }}
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
              suggestion={workflowSuggestion}
              onAccept={onWorkflowAccept}
              onDismiss={onWorkflowDismiss}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDashboard && dashboardSuggestion && (
          <motion.div
            key={
              "dash-" +
              dashboardSuggestion.dashboardId +
              dashboardSuggestion.status
            }
            initial={{ opacity: 0, x: -28, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.38, ...spring.soft }}
          >
            {!showWorkflow && (
              <div className="mb-1.5 flex items-center gap-1.5 px-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-indigo/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-indigo" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-indigo/80">
                  THEMACHINE
                </span>
              </div>
            )}
            <DashboardSuggestionCard
              variant="notification"
              suggestion={dashboardSuggestion}
              onAccept={onDashboardAccept}
              onDismiss={onDashboardDismiss}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
