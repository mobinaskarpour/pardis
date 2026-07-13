"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { spring } from "@/lib/motion";
import type {
  Conversation,
  HistoryCategory,
  WorkspaceMessage,
} from "@/lib/ai-workspace-data";
import { historyCategories } from "@/lib/ai-workspace-data";
import { getCategoryLabel } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";
import { ThinkingState } from "./ThinkingState";
import { StreamingText } from "./StreamingText";
import { WorkflowSuggestionCard } from "./WorkflowSuggestionCard";

interface ConversationPanelProps {
  conversations: Conversation[];
  activeId: string | null;
  messages: WorkspaceMessage[];
  thinking: boolean;
  streamingMessageId: string | null;
  activeCategory: HistoryCategory | "all";
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onCategoryChange: (category: HistoryCategory | "all") => void;
  onSuggestionClick: (question: string) => void;
  onThinkingComplete: () => void;
  onAcceptWorkflowSuggestion: (messageId: string, workflowId: string) => void;
  onDismissWorkflowSuggestion: (messageId: string) => void;
}

export function ConversationPanel({
  conversations,
  activeId,
  messages,
  thinking,
  streamingMessageId,
  activeCategory,
  onSelectConversation,
  onNewConversation,
  onCategoryChange,
  onSuggestionClick,
  onThinkingComplete,
  onAcceptWorkflowSuggestion,
  onDismissWorkflowSuggestion,
}: ConversationPanelProps) {
  const filtered =
    activeCategory === "all"
      ? conversations
      : conversations.filter((c) => c.category === activeCategory);

  // Keep the compact message thread pinned to the latest message
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, streamingMessageId]);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <aside className="hidden md:flex flex-col w-[280px] shrink-0 border-l border-border bg-bg-elevated/40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <p className="text-[13px] font-medium text-text-tertiary">Conversation</p>
        <motion.button
          type="button"
          onClick={onNewConversation}
          whileHover={{ y: -2, transition: spring.gentle }}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border text-text-tertiary transition-colors duration-[120ms] hover:border-border-hover cursor-pointer"
          aria-label="گفتگوی جدید"
        >
          <Plus size={14} strokeWidth={1.75} />
        </motion.button>
      </div>

      {/* Smart History categories */}
      <div className="flex gap-1 p-3 border-b border-border overflow-x-auto">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "shrink-0 rounded-[6px] px-2 py-1 text-[11px] transition-colors duration-[120ms] cursor-pointer",
            activeCategory === "all"
              ? "bg-primary/10 text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          همه
        </button>
        {historyCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "shrink-0 rounded-[6px] px-2 py-1 text-[11px] transition-colors duration-[120ms] cursor-pointer",
              activeCategory === cat.id
                ? "bg-primary/10 text-primary"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        {filtered.map((conv) => (
          <motion.button
            key={conv.id}
            type="button"
            onClick={() => onSelectConversation(conv.id)}
            whileHover={{ x: 2, transition: spring.gentle }}
            className={cn(
              "w-full rounded-[10px] p-3 text-right transition-colors duration-[120ms] cursor-pointer",
              activeId === conv.id
                ? "bg-primary/5 border border-border-hover"
                : "border border-transparent hover:bg-bg-subtle"
            )}
          >
            <p className="text-[13px] font-medium text-text-primary truncate">
              {conv.title}
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
              {conv.preview}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-text-tertiary">
                {getCategoryLabel(conv.category)}
              </span>
              <span className="text-[11px] text-text-tertiary">
                {conv.updatedAt}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Active conversation messages (compact) */}
      <div
        ref={messagesRef}
        className="border-t border-border p-3 max-h-[40%] overflow-y-auto min-h-[120px]"
      >
        {messages.length === 0 && !thinking && (
          <p className="text-[13px] text-text-tertiary text-center py-4">
            گفتگوی جدید
          </p>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={spring.gentle}
            className={cn(
              "mb-3",
              msg.role === "user" ? "text-left" : "text-right"
            )}
          >
            {msg.role === "user" ? (
              <div className="inline-block rounded-[10px] bg-bg-subtle px-3 py-2 text-[13px] text-text-primary">
                {msg.content}
              </div>
            ) : streamingMessageId === msg.id ? (
              <StreamingText text={msg.content} />
            ) : (
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {msg.content}
              </p>
            )}

            {msg.workflowSuggestion && streamingMessageId !== msg.id && (
              <div className="mt-2">
                <WorkflowSuggestionCard
                  suggestion={msg.workflowSuggestion}
                  onAccept={() =>
                    onAcceptWorkflowSuggestion(
                      msg.id,
                      msg.workflowSuggestion!.workflowId
                    )
                  }
                  onDismiss={() => onDismissWorkflowSuggestion(msg.id)}
                />
              </div>
            )}
          </motion.div>
        ))}

        <ThinkingState active={thinking} onComplete={onThinkingComplete} />

        {lastAssistant?.suggestedQuestions && !thinking && (
          <div className="mt-3 space-y-1">
            {lastAssistant.suggestedQuestions.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onSuggestionClick(q)}
                className="block w-full text-right text-[11px] text-primary/80 hover:text-primary transition-colors duration-[120ms] cursor-pointer py-0.5"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
