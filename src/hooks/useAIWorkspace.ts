"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  CanvasType,
  Conversation,
  HistoryCategory,
  WorkspaceMessage,
} from "@/lib/ai-workspace-data";
import type { WorkflowGenerationPhase } from "@/types/ai";
import { initialConversations } from "@/lib/ai-workspace-data";
import { processAIQuery } from "@/lib/ai-engine";
import { useWorkflowStore } from "@/store/workflow-store";
import type { Workflow } from "@/types/workflow";
import type { WorkflowSuggestion } from "@/types";
import {
  getThinkingSteps,
  inferTimeGroup,
} from "@/mock/data/chat-experience";
import {
  buildDemoWorkflowDraft,
  detectDemoWorkflow,
  patternToSuggestion,
  type DemoWorkflowPattern,
} from "@/mock/data/workflow-detection-demo";

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedConversations(): Conversation[] {
  return initialConversations.map((c) => ({
    ...c,
    timeGroup: inferTimeGroup(c.updatedAt),
    pinned: c.id === "conv-1",
    favorite: c.id === "conv-1" || c.id === "conv-dose",
  }));
}

const PHASE_DURATIONS = [2000, 2400, 2200, 2600];

export function useAIWorkspace(initialQuery?: string) {
  const [conversations, setConversations] =
    useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<HistoryCategory | "all">(
    "all"
  );
  const [historySearch, setHistorySearch] = useState("");
  const [previewCanvas, setPreviewCanvas] = useState<CanvasType | null>(null);
  const [thinking, setThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
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

  const pendingDraftsRef = useRef<Record<string, Workflow>>({});
  const pendingPatternRef = useRef<DemoWorkflowPattern | null>(null);

  const appendDetectionMessage = useCallback(
    (convId: string, pattern: DemoWorkflowPattern) => {
      const draft = buildDemoWorkflowDraft(pattern);
      pendingDraftsRef.current[draft.id] = draft;

      const detectionMsg: WorkspaceMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        workflowSuggestion: patternToSuggestion(pattern, draft),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, detectionMsg] }
            : c
        )
      );
    },
    []
  );

  const finishResponse = useCallback(
    (userContent: string, convId: string | null) => {
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
        memoryContext: response.memoryContext,
        responseFormat: response.responseFormat,
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
                  timeGroup: "today",
                  category: response.category ?? c.category,
                }
              : c
          )
        );
      }

      const streamMs = response.content.length * 18 + 500;
      setTimeout(() => setStreamingMessageId(null), streamMs);

      const pattern = pendingPatternRef.current;
      if (convId && pattern) {
        const detectionDelay = streamMs + 1200 + Math.random() * 600;
        setTimeout(() => {
          appendDetectionMessage(convId, pattern);
          pendingPatternRef.current = null;
        }, detectionDelay);
      }
    },
    [appendDetectionMessage]
  );

  const [pendingQuery, setPendingQuery] = useState<{
    content: string;
    convId: string | null;
  } | null>(null);

  const submitQuery = useCallback(
    (content: string) => {
      if (thinking) return;

      const pattern = detectDemoWorkflow(content);
      pendingPatternRef.current = pattern;

      setThinkingSteps(getThinkingSteps(content));

      const userMsg: WorkspaceMessage = {
        id: generateId(),
        role: "user",
        content,
      };

      let convId = activeId;

      if (!convId) {
        const newConv: Conversation = {
          id: generateId(),
          title: content.slice(0, 28),
          category: "sessions",
          preview: content,
          updatedAt: "اکنون",
          timeGroup: "today",
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
              ? {
                  ...c,
                  messages: [...c.messages, userMsg],
                  preview: content,
                  updatedAt: "اکنون",
                  timeGroup: "today",
                }
              : c
          )
        );
      }

      setThinking(true);
      setPendingQuery({ content, convId });
    },
    [activeId, thinking]
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
      finishResponse(pendingQuery.content, pendingQuery.convId);
      setPendingQuery(null);
    }
  }, [pendingQuery, finishResponse]);

  const updateSuggestion = useCallback(
    (
      messageId: string,
      patch: Partial<WorkflowSuggestion>
    ) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId && m.workflowSuggestion
              ? {
                  ...m,
                  workflowSuggestion: { ...m.workflowSuggestion, ...patch },
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
      updateSuggestion(messageId, {
        status: "generating",
        generationPhase: "analyzing",
      });

      let elapsed = PHASE_DURATIONS[0] ?? 2000;
      (["building", "connecting", "dashboard"] as WorkflowGenerationPhase[]).forEach(
        (phase, i) => {
          setTimeout(() => {
            updateSuggestion(messageId, {
              status: "generating",
              generationPhase: phase,
            });
          }, elapsed);
          elapsed += PHASE_DURATIONS[i + 1] ?? 2200;
        }
      );

      const totalDuration = PHASE_DURATIONS.reduce((s, d) => s + d, 0) + 400;

      setTimeout(() => {
        const draft = pendingDraftsRef.current[workflowId];
        if (draft) {
          useWorkflowStore.getState().addWorkflow({
            ...draft,
            enabled: true,
            source: "ai",
          });
          delete pendingDraftsRef.current[workflowId];
        }
        updateSuggestion(messageId, {
          status: "accepted",
          generationPhase: "complete",
        });
      }, totalDuration);
    },
    [updateSuggestion]
  );

  const dismissWorkflowSuggestion = useCallback(
    (messageId: string) =>
      updateSuggestion(messageId, { status: "dismissed" }),
    [updateSuggestion]
  );

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setPreviewCanvas(null);
  }, []);

  const newConversation = useCallback(() => {
    setActiveId(null);
    setPreviewCanvas(null);
    pendingPatternRef.current = null;
  }, []);

  const togglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    );
  }, []);

  const handleAction = useCallback(
    (actionId: string) => {
      const actionQueries: Record<string, string> = {
        workflow: "ساخت Workflow جدید",
        report: "گزارش‌های باز امروز",
        pdf: "تبدیل به PDF",
        save: "ذخیره تحلیل",
        share: "اشتراک‌گذاری",
      };
      const q = actionQueries[actionId];
      if (q) submitQuery(q);
    },
    [submitQuery]
  );

  return {
    conversations,
    activeId,
    messages,
    canvas,
    thinking,
    thinkingSteps,
    streamingMessageId,
    activeCategory,
    historySearch,
    context,
    submitQuery,
    selectConversation,
    newConversation,
    setActiveCategory,
    setHistorySearch,
    onThinkingComplete,
    acceptWorkflowSuggestion,
    dismissWorkflowSuggestion,
    togglePin,
    toggleFavorite,
    handleAction,
  };
}
