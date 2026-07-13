"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { AICanvas } from "./canvas/AICanvas";
import { CommandInput } from "@/components/command-center/CommandInput";
import { defaultCommandSuggestions } from "@/mock/data/command-suggestions";
import { LivingCore } from "@/components/command-center/LivingCore";
import { AIThinking } from "@/components/core/AIThinking";
import { StreamingText } from "./StreamingText";
import { WorkflowSuggestionCard } from "./WorkflowSuggestionCard";
import { useAIWorkspace } from "@/hooks/useAIWorkspace";
import { pageLabels } from "@/config/labels";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare } from "lucide-react";

interface AIWorkspacePageProps {
  /** Query handed off from the dashboard chat box — submitted on mount */
  initialQuery?: string;
}

export function AIWorkspacePage({ initialQuery }: AIWorkspacePageProps) {
  const {
    conversations,
    activeId,
    messages,
    canvas,
    thinking,
    streamingMessageId,
    context,
    submitQuery,
    selectConversation,
    newConversation,
    onThinkingComplete,
    acceptWorkflowSuggestion,
    dismissWorkflowSuggestion,
  } = useAIWorkspace(initialQuery);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking, canvas]);

  const hasMessages = messages.length > 0;

  return (
    <AppShell pageTitle={pageLabels.chat} hideFloatingAI>
      <div className="flex min-h-[calc(100vh-60px)] flex-col">
        {/* Conversation history sidebar — minimal strip */}
        <div className="border-b border-border px-6 py-3 md:px-10">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={newConversation}
              className="flex shrink-0 items-center gap-1.5 rounded-full glass-subtle px-3 py-1.5 text-[var(--text-sm)] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <Plus size={14} />
              گفتگوی جدید
            </button>
            {conversations.slice(0, 6).map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => selectConversation(conv.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[var(--text-sm)] transition-colors cursor-pointer",
                  activeId === conv.id
                    ? "bg-primary/10 text-primary"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-bg-subtle/60"
                )}
              >
                <MessageSquare size={13} />
                {conv.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main content — conversation + generated UI */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none">
          <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
            {!hasMessages && !thinking ? (
              <div className="flex flex-col items-center text-center pt-12 pb-8">
                <LivingCore size="sm" />
                <h2 className="mt-8 text-heading text-text-primary">
                  با ماشین صحبت کنید
                </h2>
                <p className="mt-2 text-[var(--text-body)] text-text-tertiary max-w-md">
                  پاسخ‌ها فقط متن نیستند — ماشین رابط را می‌سازد.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring.soft}
                  >
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="rounded-[var(--radius-xl)] bg-primary/10 px-5 py-3 max-w-lg">
                          <p className="text-[var(--text-body)] text-text-primary">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-[var(--radius-xl)] glass-subtle px-5 py-4 max-w-2xl">
                          {streamingMessageId === msg.id ? (
                            <StreamingText text={msg.content} />
                          ) : (
                            <p className="text-[var(--text-body-lg)] text-text-primary leading-relaxed">
                              {msg.content}
                            </p>
                          )}
                        </div>

                        {msg.workflowSuggestion &&
                          streamingMessageId !== msg.id && (
                            <WorkflowSuggestionCard
                              suggestion={msg.workflowSuggestion}
                              onAccept={() =>
                                acceptWorkflowSuggestion(
                                  msg.id,
                                  msg.workflowSuggestion!.workflowId
                                )
                              }
                              onDismiss={() =>
                                dismissWorkflowSuggestion(msg.id)
                              }
                            />
                          )}

                        {msg.canvas && msg.canvas !== "welcome" && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={spring.soft}
                            className="rounded-[var(--radius-2xl)] glass overflow-hidden"
                          >
                            <AICanvas
                              canvas={msg.canvas}
                              onSuggestionClick={submitQuery}
                            />
                          </motion.div>
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
                    >
                      <AIThinking
                        active
                        steps={[
                          "تحلیل درخواست...",
                          "جستجو در داده‌ها...",
                          "ساخت رابط...",
                        ]}
                        onComplete={onThinkingComplete}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Context actions */}
            {context.actions && context.actions.length > 0 && hasMessages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex flex-wrap gap-2"
              >
                {context.actions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className="rounded-full glass-subtle px-4 py-2 text-[var(--text-sm)] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Prompt — fixed at bottom */}
        <div className="sticky bottom-0 border-t border-border bg-bg/80 backdrop-blur-xl px-6 py-5 md:px-10">
          <CommandInput
            onSubmit={submitQuery}
            disabled={thinking}
            suggestions={!hasMessages ? defaultCommandSuggestions : []}
            autoFocus={false}
          />
        </div>
      </div>
    </AppShell>
  );
}
