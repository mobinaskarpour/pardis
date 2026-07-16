"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { AICanvas } from "./canvas/AICanvas";
import { AIThinking } from "@/components/core/AIThinking";
import { StreamingText } from "./StreamingText";
import { WorkflowSuggestionNotification } from "./WorkflowSuggestionNotification";
import { ChatHero } from "./ChatHero";
import { SuggestedActionPills } from "./SuggestedActionPills";
import { PremiumChatInput } from "./PremiumChatInput";
import { ConversationHistoryPanel } from "./ConversationHistoryPanel";
import { MemoryContextChip } from "./MemoryContextChip";
import { DashboardGenerationCard } from "./DashboardGenerationCard";
import { LivingCore } from "@/components/command-center/LivingCore";
import { useAIWorkspace } from "@/hooks/useAIWorkspace";
import { pageLabels } from "@/config/labels";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const formatLabels: Record<string, string> = {
  answer: "پاسخ",
  timeline: "Timeline",
  workflow: "Workflow",
  chart: "نمودار",
  "executive-summary": "خلاصه اجرایی",
  dashboard: "Dashboard",
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
    submitQuery,
    selectConversation,
    newConversation,
    setHistorySearch,
    onThinkingComplete,
    acceptWorkflowSuggestion,
    dismissWorkflowSuggestion,
    togglePin,
    toggleFavorite,
    handleAction,
  } = useAIWorkspace(initialQuery);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const isNewChat = !hasMessages && !thinking;

  const activeWorkflowMessage = [...messages]
    .reverse()
    .find(
      (m) =>
        m.role === "assistant" &&
        m.workflowSuggestion &&
        m.workflowSuggestion.status !== "dismissed" &&
        streamingMessageId !== m.id
    );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  return (
    <AppShell pageTitle={pageLabels.chat} hideFloatingAI>
      <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-[#eef0f3]">
        {/* Main conversation column */}
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
                        <div className="rounded-[18px] bg-primary px-5 py-3 max-w-lg shadow-sm">
                          <p className="text-[15px] text-white leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {msg.memoryContext && (
                          <MemoryContextChip text={msg.memoryContext} />
                        )}

                        {msg.responseFormat && msg.responseFormat !== "answer" && (
                          <span className="inline-block rounded-[6px] bg-bg-subtle px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                            {formatLabels[msg.responseFormat] ?? msg.responseFormat}
                          </span>
                        )}

                        {msg.content && (
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-1">
                              <LivingCore size="sm" variant="ambient" active={thinking} />
                            </div>
                            <div className="flex-1 rounded-[18px] border border-border/60 bg-white px-5 py-4 shadow-sm max-w-2xl">
                              {streamingMessageId === msg.id ? (
                                <StreamingText text={msg.content} />
                              ) : (
                                <p className="text-[15px] text-text-primary leading-[1.75]">
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

                        {msg.canvas &&
                          msg.canvas !== "welcome" &&
                          streamingMessageId !== msg.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={spring.soft}
                              className="rounded-[20px] border border-border/60 bg-white overflow-hidden shadow-sm"
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
                                  className="rounded-full border border-border/60 bg-white px-3.5 py-1.5 text-[12px] text-text-secondary hover:border-primary/25 hover:text-primary transition-colors"
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
                        className="flex-1 border-primary/15 bg-white shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Input — sticky bottom when in conversation */}
          {!isNewChat && (
            <div className="shrink-0 border-t border-border/60 bg-white/90 backdrop-blur-xl px-6 py-4">
              <PremiumChatInput
                onSubmit={submitQuery}
                disabled={thinking}
                showQuickCommands
              />
            </div>
          )}

          {context.actions && context.actions.length > 0 && hasMessages && (
            <div className="shrink-0 border-t border-border/40 bg-[#fafbfc] px-6 py-2 flex flex-wrap gap-2">
              {context.actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleAction(action.id)}
                  className={cn(
                    "rounded-full border border-border/60 bg-white px-3.5 py-1.5",
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

      <WorkflowSuggestionNotification
        suggestion={activeWorkflowMessage?.workflowSuggestion}
        onAccept={() => {
          if (!activeWorkflowMessage?.workflowSuggestion) return;
          acceptWorkflowSuggestion(
            activeWorkflowMessage.id,
            activeWorkflowMessage.workflowSuggestion.workflowId
          );
        }}
        onDismiss={() => {
          if (!activeWorkflowMessage) return;
          dismissWorkflowSuggestion(activeWorkflowMessage.id);
        }}
      />
    </AppShell>
  );
}
