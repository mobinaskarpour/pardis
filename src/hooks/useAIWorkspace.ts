"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  CanvasType,
  Conversation,
  HistoryCategory,
  WorkspaceMessage,
} from "@/lib/ai-workspace-data";
import { initialConversations } from "@/lib/ai-workspace-data";
import { processAIQuery } from "@/lib/ai-engine";
import { detectRepeatedTask } from "@/lib/workflow-detection";
import { useWorkflowStore } from "@/store/workflow-store";
import type { Workflow } from "@/types/workflow";
import type { WorkflowSuggestion } from "@/types";

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useAIWorkspace(initialQuery?: string) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  // An incoming query (from the dashboard chat box) starts a fresh conversation
  const [activeId, setActiveId] = useState<string | null>(
    initialQuery ? null : "conv-dose"
  );
  const [activeCategory, setActiveCategory] = useState<HistoryCategory | "all">(
    "all"
  );
  const [previewCanvas, setPreviewCanvas] = useState<CanvasType | null>(null);
  const [thinking, setThinking] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  const activeConversation = conversations.find((c) => c.id === activeId);
  const messages = activeConversation?.messages ?? [];

  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant"),
    [messages]
  );

  const canvas: CanvasType = useMemo(() => {
    if (previewCanvas) return previewCanvas;
    if (lastAssistant?.canvas) return lastAssistant.canvas;
    return "welcome";
  }, [previewCanvas, lastAssistant]);

  const context = useMemo(
    () => ({
      reasoning: lastAssistant?.reasoning,
      citations: lastAssistant?.citations,
      actions: lastAssistant?.actions,
    }),
    [lastAssistant]
  );

  /** Drafts proposed by repetition detection, kept until the user accepts */
  const pendingDraftsRef = useRef<Record<string, Workflow>>({});

  const finishResponse = useCallback(
    (
      userContent: string,
      convId: string | null,
      suggestion?: WorkflowSuggestion
    ) => {
      const response = processAIQuery(userContent);
      const assistantMsg: WorkspaceMessage = {
        id: generateId(),
        role: "assistant",
        content: response.content,
        canvas: response.canvas,
        reasoning: response.reasoning,
        citations: response.citations,
        suggestedQuestions: response.suggestedQuestions,
        actions: response.actions,
        workflowSuggestion: suggestion,
      };

      setPreviewCanvas(response.canvas);
      setStreamingMessageId(assistantMsg.id);

      if (convId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: [...c.messages, assistantMsg],
                  title: response.conversationTitle ?? c.title,
                  preview: userContent,
                  updatedAt: "اکنون",
                  category: response.category ?? c.category,
                }
              : c
          )
        );
      }

      setTimeout(
        () => setStreamingMessageId(null),
        response.content.length * 18 + 500
      );
    },
    []
  );

  const [pendingQuery, setPendingQuery] = useState<{
    content: string;
    convId: string | null;
    suggestion?: WorkflowSuggestion;
  } | null>(null);

  const submitQuery = useCallback(
    (content: string) => {
      if (thinking) return;

      const detection = detectRepeatedTask(
        content,
        conversations,
        useWorkflowStore.getState().hasWorkflow
      );
      if (detection) {
        pendingDraftsRef.current[detection.draft.id] = detection.draft;
      }

      const userMsg: WorkspaceMessage = {
        id: generateId(),
        role: "user",
        content,
      };

      let convId = activeId;

      if (!convId) {
        const newConv: Conversation = {
          id: generateId(),
          title: content.slice(0, 24),
          category: "sessions",
          preview: content,
          updatedAt: "اکنون",
          messages: [userMsg],
        };
        setConversations((prev) => [newConv, ...prev]);
        convId = newConv.id;
        setActiveId(convId);
        setPreviewCanvas(null);
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, userMsg], preview: content }
              : c
          )
        );
      }

      setThinking(true);
      setPendingQuery({ content, convId, suggestion: detection?.suggestion });
    },
    [activeId, thinking, conversations]
  );

  const bootedRef = useRef(false);
  useEffect(() => {
    if (initialQuery && !bootedRef.current) {
      bootedRef.current = true;
      submitQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onThinkingComplete = useCallback(() => {
    if (pendingQuery) {
      setThinking(false);
      finishResponse(
        pendingQuery.content,
        pendingQuery.convId,
        pendingQuery.suggestion
      );
      setPendingQuery(null);
    }
  }, [pendingQuery, finishResponse]);

  const setSuggestionStatus = useCallback(
    (messageId: string, status: WorkflowSuggestion["status"]) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId && m.workflowSuggestion
              ? {
                  ...m,
                  workflowSuggestion: { ...m.workflowSuggestion, status },
                }
              : m
          ),
        }))
      );
    },
    []
  );

  const acceptWorkflowSuggestion = useCallback(
    (messageId: string, workflowId: string) => {
      const draft = pendingDraftsRef.current[workflowId];
      if (draft) {
        useWorkflowStore.getState().addWorkflow(draft);
        delete pendingDraftsRef.current[workflowId];
      }
      setSuggestionStatus(messageId, "accepted");
    },
    [setSuggestionStatus]
  );

  const dismissWorkflowSuggestion = useCallback(
    (messageId: string) => setSuggestionStatus(messageId, "dismissed"),
    [setSuggestionStatus]
  );

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setPreviewCanvas(null);
  }, []);

  const newConversation = useCallback(() => {
    setActiveId(null);
    setPreviewCanvas(null);
  }, []);

  return {
    conversations,
    activeId,
    messages,
    canvas,
    thinking,
    streamingMessageId,
    activeCategory,
    context,
    submitQuery,
    selectConversation,
    newConversation,
    setActiveCategory,
    onThinkingComplete,
    acceptWorkflowSuggestion,
    dismissWorkflowSuggestion,
  };
}
