"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { AICanvas } from "./canvas/AICanvas";
import { AIThinking } from "@/components/core/AIThinking";
import { StreamingText } from "./StreamingText";
import { ChatHero } from "./ChatHero";
import { SuggestedActionPills } from "./SuggestedActionPills";
import { PremiumChatInput } from "./PremiumChatInput";
import { ConversationHistoryPanel } from "./ConversationHistoryPanel";
import { MemoryContextChip } from "./MemoryContextChip";
import { DashboardGenerationCard } from "./DashboardGenerationCard";
import { DashboardBuilderDialog } from "./DashboardBuilderDialog";
import { WorkflowBuilderDialog } from "./WorkflowBuilderDialog";
import { AINotificationCenter } from "./AINotificationCenter";
import { VoiceAssistantOverlay } from "./voice/VoiceAssistantOverlay";
import { LivingCore } from "@/components/command-center/LivingCore";
import { useAIWorkspace } from "@/hooks/useAIWorkspace";
import { pageLabels } from "@/config/labels";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const formatLabels: Record<string, string> = {
  answer: "پاسخ",
  timeline: "خط زمان",
  workflow: "گردش‌کار",
  chart: "نمودار",
  "executive-summary": "خلاصه اجرایی",
  dashboard: "داشبورد",
  document: "سند",
  "medical-report": "گزارش پزشکی",
  "task-list": "لیست وظایف",
};

interface AIWorkspacePageProps {
  initialQuery?: string;
}

export function AIWorkspacePage({ initialQuery }: AIWorkspacePageProps) {
  const {
    conversations,
    activeId,
    messages,
    thinking,
    thinkingSteps,
    streamingMessageId,
    historySearch,
    context,
    suggestionQueue,
    submitQuery,
    selectConversation,
    newConversation,
    setHistorySearch,
    onThinkingComplete,
    handleSuggestionPrimary,
    handleSuggestionDismiss,
    dashboardBuilderOpen,
    dashboardBuilderSuggestion,
    workflowBuilderOpen,
    workflowBuilderSuggestion,
    closeDashboardBuilder,
    confirmDashboardCreation,
    closeWorkflowBuilder,
    confirmWorkflowCreation,
    togglePin,
    toggleFavorite,
    handleAction,
  } = useAIWorkspace(initialQuery);

  const [voiceOpen, setVoiceOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const isNewChat = !hasMessages && !thinking;

  const openVoice = useCallback(() => setVoiceOpen(true), []);
  const closeVoice = useCallback(() => setVoiceOpen(false), []);
  const switchVoiceToText = useCallback(() => {
    setVoiceOpen(false);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  useEffect(() => {
    if (!voiceOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [voiceOpen]);

  return (
    <AppShell pageTitle={pageLabels.chat} hideFloatingAI>
      <div className="flex h-[calc(100vh-4.5rem)] overflow-hidden bg-bg-layer-1 rounded-[var(--radius-xl)]">
        <div className="flex flex-1 flex-col min-w-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none">
            {isNewChat ? (
              <div className="mx-auto max-w-3xl px-6 py-8">
                <ChatHero />

                <div className="mt-8">
                  <PremiumChatInput
                    onSubmit={submitQuery}
                    disabled={thinking}
                    showQuickCommands
                    large
                    onVoiceOpen={openVoice}
                  />
                </div>

                <div className="mt-10">
                  <SuggestedActionPills
                    onSelect={submitQuery}
                    disabled={thinking}
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl px-6 py-6 space-y-8">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring.soft}
                  >
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="rounded-[16px] bg-primary px-4 py-2.5 max-w-lg shadow-[var(--shadow-sm)]">
                          <p className="text-[14px] text-white leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {msg.memoryContext && (
                          <MemoryContextChip text={msg.memoryContext} />
                        )}

                        {msg.responseFormat &&
                          msg.responseFormat !== "answer" && (
                            <span className="inline-block rounded-[6px] bg-bg-subtle px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                              {formatLabels[msg.responseFormat] ??
                                msg.responseFormat}
                            </span>
                          )}

                        {msg.content && (
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-1">
                              <LivingCore
                                size="sm"
                                variant="ambient"
                                active={thinking}
                              />
                            </div>
                            <div className="flex-1 rounded-[16px] border border-border bg-bg-elevated px-4 py-3.5 shadow-[var(--shadow-sm)] max-w-2xl">
                              {streamingMessageId === msg.id ? (
                                <StreamingText text={msg.content} />
                              ) : (
                                <p className="text-[14px] text-text-primary leading-[1.7]">
                                  {msg.content}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {msg.dashboardGeneration && (
                          <DashboardGenerationCard
                            generation={msg.dashboardGeneration}
                          />
                        )}

                        {msg.canvas && streamingMessageId !== msg.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={spring.soft}
                            className="rounded-[16px] border border-border bg-bg-elevated overflow-hidden shadow-[var(--shadow-sm)]"
                          >
                            <AICanvas
                              canvas={msg.canvas}
                              onSuggestionClick={submitQuery}
                            />
                          </motion.div>
                        )}

                        {msg.suggestedQuestions &&
                          msg.suggestedQuestions.length > 0 &&
                          streamingMessageId !== msg.id && (
                            <div className="flex flex-wrap gap-2">
                              {msg.suggestedQuestions.slice(0, 4).map((q) => (
                                <button
                                  key={q}
                                  type="button"
                                  onClick={() => submitQuery(q)}
                                  className="rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-[12px] text-text-secondary hover:border-primary/25 hover:text-primary transition-colors"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </motion.div>
                ))}

                <AnimatePresence>
                  {thinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3"
                    >
                      <LivingCore size="sm" variant="ambient" active />
                      <AIThinking
                        active
                        steps={thinkingSteps}
                        onComplete={onThinkingComplete}
                        className="flex-1 border-primary/15 bg-bg-elevated shadow-[var(--shadow-sm)]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {!isNewChat && (
            <div className="shrink-0 border-t border-border bg-bg-elevated/95 backdrop-blur-md px-6 py-4">
              <PremiumChatInput
                onSubmit={submitQuery}
                disabled={thinking}
                showQuickCommands
                onVoiceOpen={openVoice}
              />
            </div>
          )}

          {context.actions && context.actions.length > 0 && hasMessages && (
            <div className="shrink-0 border-t border-border/40 bg-bg-layer-1/95 px-6 py-2 flex flex-wrap gap-2">
              {context.actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleAction(action.id)}
                  className={cn(
                    "rounded-full border border-border bg-bg-elevated px-3.5 py-1.5",
                    "text-[12px] font-medium text-text-secondary",
                    "hover:border-primary/25 hover:text-primary transition-colors"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ConversationHistoryPanel
          conversations={conversations}
          activeId={activeId}
          search={historySearch}
          onSearchChange={setHistorySearch}
          onSelect={selectConversation}
          onNew={newConversation}
          onTogglePin={togglePin}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      <AINotificationCenter
        suggestions={suggestionQueue}
        onPrimary={handleSuggestionPrimary}
        onDismiss={handleSuggestionDismiss}
      />

      <WorkflowBuilderDialog
        open={workflowBuilderOpen}
        suggestion={workflowBuilderSuggestion}
        onClose={closeWorkflowBuilder}
        onConfirm={confirmWorkflowCreation}
      />

      <DashboardBuilderDialog
        open={dashboardBuilderOpen}
        suggestion={dashboardBuilderSuggestion}
        onClose={closeDashboardBuilder}
        onConfirm={confirmDashboardCreation}
      />

      <VoiceAssistantOverlay
        open={voiceOpen}
        onClose={closeVoice}
        onSubmitQuery={submitQuery}
        onSwitchToText={switchVoiceToText}
      />
    </AppShell>
  );
}
