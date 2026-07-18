"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type {
  CanvasType,
  Conversation,
  HistoryCategory,
  WorkspaceMessage,
} from "@/lib/ai-workspace-data";
import type {
  AISuggestion,
  DashboardGenerationPhase,
  DashboardQueueSuggestion,
  DashboardSuggestion,
  WorkflowGenerationPhase,
  WorkflowQueueSuggestion,
} from "@/types/ai";
import { initialConversations } from "@/lib/ai-workspace-data";
import { processAIQuery } from "@/lib/ai-engine";
import { useWorkflowStore } from "@/store/workflow-store";
import { useDashboardStore } from "@/store/dashboard-store";
import type { Workflow } from "@/types/workflow";
import type { DiscoveredDashboard } from "@/types/dashboard";
import {
  getThinkingSteps,
  inferTimeGroup,
} from "@/mock/data/chat-experience";
import {
  buildDemoWorkflowDraft,
  detectDemoWorkflow,
  demoWorkflowPatterns,
  patternToSuggestion,
  type DemoWorkflowPattern,
} from "@/mock/data/workflow-detection-demo";
import {
  buildDiscoveredDashboard,
  detectDemoDashboard,
  demoDashboardPatterns,
  patternToDashboardSuggestion,
  type DemoDashboardPattern,
} from "@/mock/data/dashboard-detection-demo";

/** Shared scenario pairs — when one side matches, both cards must appear */
const DISCOVERY_PAIRS: { workflowId: string; dashboardId: string }[] = [
  { workflowId: "mri-ready", dashboardId: "mri-prep" },
  { workflowId: "insurance", dashboardId: "insurance-tracking" },
  { workflowId: "appointments", dashboardId: "appointments-tomorrow" },
];

function resolvePairedDiscoveries(
  workflowPattern: DemoWorkflowPattern | null,
  dashboardPattern: DemoDashboardPattern | null
): {
  workflow: DemoWorkflowPattern | null;
  dashboard: DemoDashboardPattern | null;
} {
  let workflow = workflowPattern;
  let dashboard = dashboardPattern;

  for (const pair of DISCOVERY_PAIRS) {
    const wfMatch = workflow?.id === pair.workflowId;
    const dashMatch = dashboard?.id === pair.dashboardId;
    if (wfMatch || dashMatch) {
      workflow =
        workflow ??
        demoWorkflowPatterns.find((p) => p.id === pair.workflowId) ??
        null;
      dashboard =
        dashboard ??
        demoDashboardPatterns.find((p) => p.id === pair.dashboardId) ??
        null;
      break;
    }
  }

  return { workflow, dashboard };
}

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function suggestionId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedConversations(): Conversation[] {
  return initialConversations.map((c) => ({
    ...c,
    timeGroup: inferTimeGroup(c.updatedAt),
    pinned: c.id === "conv-1",
    favorite: c.id === "conv-1" || c.id === "conv-dose",
  }));
}

const WORKFLOW_PHASE_DURATIONS = [2000, 2400, 2200, 2600];
const DASHBOARD_PHASE_DURATIONS = [1800, 2000, 2200];

function workflowToQueueItem(
  pattern: DemoWorkflowPattern,
  draft: Workflow,
  conversationId: string,
  messageId: string
): WorkflowQueueSuggestion {
  const legacy = patternToSuggestion(pattern, draft);
  return {
    id: suggestionId("sug-wf"),
    type: "workflow",
    status: "pending",
    title: "⚙️ فرآیند جدید شناسایی شد",
    subtitle: legacy.workflowName,
    description:
      "این گفتگو یک فرآیند تکرارشونده را شناسایی کرده است و می‌تواند به یک Workflow قابل اجرا تبدیل شود.",
    primaryLabel: "⚡ ایجاد Workflow",
    secondaryLabel: "بعداً",
    conversationId,
    messageId,
    createdAt: Date.now(),
    workflowId: legacy.workflowId,
    workflowName: legacy.workflowName,
    dashboardName: legacy.dashboardName,
    dashboardWidgets: legacy.dashboardWidgets,
    connectedSystems: legacy.connectedSystems,
    triggerLabel: legacy.triggerLabel,
    actionLabels: legacy.actionLabels,
    repeatCount: legacy.repeatCount,
    reason: legacy.reason,
  };
}

function dashboardToQueueItem(
  pattern: DemoDashboardPattern,
  conversationId: string,
  messageId: string
): DashboardQueueSuggestion {
  const legacy = patternToDashboardSuggestion(pattern);
  return {
    id: suggestionId("sug-dash"),
    type: "dashboard",
    status: "pending",
    title: "📊 داشبورد جدید شناسایی شد",
    subtitle: legacy.dashboardName,
    description:
      "این گفتگو می‌تواند به یک داشبورد دائمی تبدیل شود.",
    primaryLabel: "📊 ایجاد داشبورد",
    secondaryLabel: "بعداً",
    conversationId,
    messageId,
    createdAt: Date.now(),
    dashboardId: legacy.dashboardId,
    dashboardName: legacy.dashboardName,
    scenarioName: legacy.scenarioName,
    widgets: legacy.widgets,
    widgetCount: legacy.widgetCount,
    reason: legacy.reason,
  };
}

function extraSuggestionsForPattern(
  content: string,
  conversationId: string,
  messageId: string
): AISuggestion[] {
  const q = content.toLowerCase();
  const extras: AISuggestion[] = [];
  const base = {
    conversationId,
    messageId,
    createdAt: Date.now(),
    status: "pending" as const,
    secondaryLabel: "بعداً",
  };

  if (q.includes("تأخیر") || q.includes("تاخیر") || q.includes("هشدار")) {
    extras.push({
      ...base,
      id: suggestionId("sug-alert"),
      type: "alert",
      title: "هشدار عملیاتی شناسایی شد",
      subtitle: "موارد نیازمند پیگیری فوری",
      primaryLabel: "مشاهده هشدارها",
      detail: "تأخیر گزارش یا ظرفیت بحرانی در گفتگو تشخیص داده شد.",
    });
  }

  if (q.includes("یادآوری") || q.includes("فردا") || q.includes("نوبت")) {
    extras.push({
      ...base,
      id: suggestionId("sug-reminder"),
      type: "reminder",
      title: "یادآوری هوشمند پیشنهاد شد",
      subtitle: "یادآوری نوبت‌ها و پیگیری‌ها",
      primaryLabel: "ایجاد یادآوری",
      detail: "می‌توان یادآوری خودکار برای نوبت‌های فردا تنظیم کرد.",
    });
  }

  if (q.includes("گزارش") && (q.includes("pdf") || q.includes("خلاصه"))) {
    extras.push({
      ...base,
      id: suggestionId("sug-report"),
      type: "report",
      title: "گزارش اجرایی آماده ساخت است",
      subtitle: "خلاصه روزانه مرکز",
      primaryLabel: "تولید گزارش",
      detail: "از این گفتگو می‌توان گزارش PDF اجرایی ساخت.",
    });
  }

  if (q.includes("خودکار") || q.includes("اتوماسیون") || q.includes("ارسال نتایج")) {
    extras.push({
      ...base,
      id: suggestionId("sug-auto"),
      type: "automation",
      title: "اتوماسیون جدید پیشنهاد شد",
      subtitle: "قانون خودکار از گفتگو استخراج شد",
      primaryLabel: "فعال‌سازی اتوماسیون",
      detail: "الگوی تکراری قابل تبدیل به قانون اتوماسیون است.",
    });
  }

  return extras;
}

export function useAIWorkspace(initialQuery?: string) {
  const router = useRouter();
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
  const [suggestionQueue, setSuggestionQueue] = useState<AISuggestion[]>([]);
  const [dashboardBuilderOpen, setDashboardBuilderOpen] = useState(false);
  const [dashboardBuilderId, setDashboardBuilderId] = useState<string | null>(
    null
  );
  const [workflowBuilderOpen, setWorkflowBuilderOpen] = useState(false);
  const [workflowBuilderId, setWorkflowBuilderId] = useState<string | null>(
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

  /** Active suggestions for current conversation (or all if no active chat) */
  const activeSuggestions = useMemo(() => {
    const list = suggestionQueue.filter(
      (s) =>
        s.status !== "dismissed" &&
        (!activeId || s.conversationId === activeId)
    );
    return list.sort((a, b) => a.createdAt - b.createdAt);
  }, [suggestionQueue, activeId]);

  const pendingDraftsRef = useRef<Record<string, Workflow>>({});
  const pendingDashboardDraftsRef = useRef<Record<string, DiscoveredDashboard>>(
    {}
  );
  const pendingWorkflowPatternRef = useRef<DemoWorkflowPattern | null>(null);
  const pendingDashboardPatternRef = useRef<DemoDashboardPattern | null>(null);

  const enqueueSuggestions = useCallback((items: AISuggestion[]) => {
    if (items.length === 0) return;
    setSuggestionQueue((prev) => {
      // Never replace — append independent cards
      const next = [...prev];
      for (const item of items) {
        const dup = next.some(
          (s) =>
            s.status !== "dismissed" &&
            s.type === item.type &&
            ((s.type === "workflow" &&
              item.type === "workflow" &&
              s.workflowId === item.workflowId) ||
              (s.type === "dashboard" &&
                item.type === "dashboard" &&
                s.dashboardId === item.dashboardId) ||
              (s.type === item.type &&
                s.subtitle === item.subtitle &&
                s.conversationId === item.conversationId))
        );
        if (!dup) next.push(item);
      }
      return next;
    });
  }, []);

  const patchSuggestion = useCallback(
    (id: string, patch: Partial<AISuggestion>) => {
      setSuggestionQueue((prev) =>
        prev.map((s) => (s.id === id ? ({ ...s, ...patch } as AISuggestion) : s))
      );
    },
    []
  );

  const removeSuggestion = useCallback((id: string) => {
    setSuggestionQueue((prev) =>
      prev.map((s) =>
        s.id === id ? ({ ...s, status: "dismissed" } as AISuggestion) : s
      )
    );
  }, []);

  const enqueueFromDetection = useCallback(
    (
      convId: string,
      messageId: string,
      userContent: string,
      workflowPattern: DemoWorkflowPattern | null,
      dashboardPattern: DemoDashboardPattern | null
    ) => {
      const paired = resolvePairedDiscoveries(
        workflowPattern,
        dashboardPattern
      );
      const items: AISuggestion[] = [];

      // Always enqueue independently — never replace one with the other
      if (paired.workflow) {
        const draft = buildDemoWorkflowDraft(paired.workflow);
        pendingDraftsRef.current[draft.id] = draft;
        items.push(
          workflowToQueueItem(paired.workflow, draft, convId, messageId)
        );
      }

      if (paired.dashboard) {
        const draft = buildDiscoveredDashboard(paired.dashboard);
        pendingDashboardDraftsRef.current[draft.id] = draft;
        items.push(
          dashboardToQueueItem(paired.dashboard, convId, messageId)
        );
      }

      // Only add extras when we already have core discoveries, keep panel focused
      if (items.length > 0) {
        const extras = extraSuggestionsForPattern(
          userContent,
          convId,
          messageId
        ).slice(0, 1);
        items.push(...extras);
      }

      enqueueSuggestions(items);
    },
    [enqueueSuggestions]
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

      const dashboardPattern = pendingDashboardPatternRef.current;
      const workflowPattern = pendingWorkflowPatternRef.current;

      if (convId && (dashboardPattern || workflowPattern)) {
        const detectionDelay = streamMs + 900 + Math.random() * 400;
        setTimeout(() => {
          enqueueFromDetection(
            convId,
            assistantMsg.id,
            userContent,
            workflowPattern,
            dashboardPattern
          );
          pendingWorkflowPatternRef.current = null;
          pendingDashboardPatternRef.current = null;
        }, detectionDelay);
      }
    },
    [enqueueFromDetection]
  );

  const [pendingQuery, setPendingQuery] = useState<{
    content: string;
    convId: string | null;
  } | null>(null);

  const submitQuery = useCallback(
    (content: string) => {
      if (thinking) return;

      pendingDashboardPatternRef.current = detectDemoDashboard(content);
      pendingWorkflowPatternRef.current = detectDemoWorkflow(content);

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

  const openWorkflowBuilder = useCallback(
    (id: string) => {
      setWorkflowBuilderId(id);
      setWorkflowBuilderOpen(true);
      patchSuggestion(id, {
        status: "preview",
      } as Partial<WorkflowQueueSuggestion>);
    },
    [patchSuggestion]
  );

  const closeWorkflowBuilder = useCallback(() => {
    if (workflowBuilderId) {
      const item = suggestionQueue.find((s) => s.id === workflowBuilderId);
      if (item?.type === "workflow" && item.status === "preview") {
        patchSuggestion(workflowBuilderId, {
          status: "pending",
        } as Partial<WorkflowQueueSuggestion>);
      }
    }
    setWorkflowBuilderOpen(false);
    setWorkflowBuilderId(null);
  }, [workflowBuilderId, suggestionQueue, patchSuggestion]);

  const confirmWorkflowCreation = useCallback(() => {
    if (!workflowBuilderId) return;
    const item = suggestionQueue.find((s) => s.id === workflowBuilderId);
    if (!item || item.type !== "workflow") return;

    const workflowId = item.workflowId;
    const sid = workflowBuilderId;

    patchSuggestion(sid, {
      status: "generating",
      generationPhase: "analyzing",
    } as Partial<WorkflowQueueSuggestion>);

    let elapsed = WORKFLOW_PHASE_DURATIONS[0] ?? 2000;
    (
      ["building", "connecting", "dashboard"] as WorkflowGenerationPhase[]
    ).forEach((phase, i) => {
      setTimeout(() => {
        patchSuggestion(sid, {
          status: "generating",
          generationPhase: phase,
        } as Partial<WorkflowQueueSuggestion>);
      }, elapsed);
      elapsed += WORKFLOW_PHASE_DURATIONS[i + 1] ?? 2200;
    });

    const totalDuration =
      WORKFLOW_PHASE_DURATIONS.reduce((s, d) => s + d, 0) + 400;

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
      setWorkflowBuilderOpen(false);
      setWorkflowBuilderId(null);
      // Remove only the Workflow card — Dashboard stays
      removeSuggestion(sid);
      router.push(`/workflows/${workflowId}`);
    }, totalDuration);
  }, [
    workflowBuilderId,
    suggestionQueue,
    patchSuggestion,
    removeSuggestion,
    router,
  ]);

  const openDashboardBuilder = useCallback(
    (id: string) => {
      setDashboardBuilderId(id);
      setDashboardBuilderOpen(true);
      patchSuggestion(id, {
        status: "preview",
      } as Partial<DashboardQueueSuggestion>);
    },
    [patchSuggestion]
  );

  const closeDashboardBuilder = useCallback(() => {
    if (dashboardBuilderId) {
      const item = suggestionQueue.find((s) => s.id === dashboardBuilderId);
      if (item?.type === "dashboard" && item.status === "preview") {
        patchSuggestion(dashboardBuilderId, {
          status: "pending",
        } as Partial<DashboardQueueSuggestion>);
      }
    }
    setDashboardBuilderOpen(false);
    setDashboardBuilderId(null);
  }, [dashboardBuilderId, suggestionQueue, patchSuggestion]);

  const confirmDashboardCreation = useCallback(() => {
    if (!dashboardBuilderId) return;
    const item = suggestionQueue.find((s) => s.id === dashboardBuilderId);
    if (!item || item.type !== "dashboard") return;

    const dashboardId = item.dashboardId;
    const sid = dashboardBuilderId;

    patchSuggestion(sid, {
      status: "generating",
      generationPhase: "analyzing",
    } as Partial<DashboardQueueSuggestion>);

    let elapsed = DASHBOARD_PHASE_DURATIONS[0] ?? 1800;
    (["selecting", "building"] as DashboardGenerationPhase[]).forEach(
      (phase, i) => {
        setTimeout(() => {
          patchSuggestion(sid, {
            status: "generating",
            generationPhase: phase,
          } as Partial<DashboardQueueSuggestion>);
        }, elapsed);
        elapsed += DASHBOARD_PHASE_DURATIONS[i + 1] ?? 2000;
      }
    );

    const totalDuration =
      DASHBOARD_PHASE_DURATIONS.reduce((s, d) => s + d, 0) + 500;

    setTimeout(() => {
      const draft = pendingDashboardDraftsRef.current[dashboardId];
      if (draft) {
        useDashboardStore.getState().addDashboard(draft);
        delete pendingDashboardDraftsRef.current[dashboardId];
      }
      setDashboardBuilderOpen(false);
      setDashboardBuilderId(null);
      // Remove only the Dashboard card — Workflow stays
      removeSuggestion(sid);
      router.push(`/dashboards/${dashboardId}`);
    }, totalDuration);
  }, [
    dashboardBuilderId,
    suggestionQueue,
    patchSuggestion,
    removeSuggestion,
    router,
  ]);

  const handleSuggestionPrimary = useCallback(
    (id: string) => {
      const item = suggestionQueue.find((s) => s.id === id);
      if (!item) return;

      switch (item.type) {
        case "workflow":
          openWorkflowBuilder(id);
          break;
        case "dashboard":
          openDashboardBuilder(id);
          break;
        case "automation":
        case "report":
        case "reminder":
        case "alert":
          removeSuggestion(id);
          break;
      }
    },
    [
      suggestionQueue,
      openWorkflowBuilder,
      openDashboardBuilder,
      removeSuggestion,
    ]
  );

  const handleSuggestionDismiss = useCallback(
    (id: string) => {
      if (dashboardBuilderId === id) {
        setDashboardBuilderOpen(false);
        setDashboardBuilderId(null);
      }
      if (workflowBuilderId === id) {
        setWorkflowBuilderOpen(false);
        setWorkflowBuilderId(null);
      }
      removeSuggestion(id);
    },
    [dashboardBuilderId, workflowBuilderId, removeSuggestion]
  );

  const dashboardBuilderSuggestion =
    useMemo((): DashboardSuggestion | null => {
      if (!dashboardBuilderId) return null;
      const item = suggestionQueue.find((s) => s.id === dashboardBuilderId);
      if (!item || item.type !== "dashboard") return null;
      return {
        status: item.status,
        reason: item.reason,
        dashboardId: item.dashboardId,
        dashboardName: item.dashboardName,
        scenarioName: item.scenarioName,
        widgets: item.widgets,
        widgetCount: item.widgetCount,
        generationPhase: item.generationPhase,
      };
    }, [dashboardBuilderId, suggestionQueue]);

  const workflowBuilderSuggestion =
    useMemo((): WorkflowQueueSuggestion | null => {
      if (!workflowBuilderId) return null;
      const item = suggestionQueue.find((s) => s.id === workflowBuilderId);
      if (!item || item.type !== "workflow") return null;
      return item;
    }, [workflowBuilderId, suggestionQueue]);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setPreviewCanvas(null);
  }, []);

  const newConversation = useCallback(() => {
    setActiveId(null);
    setPreviewCanvas(null);
    pendingWorkflowPatternRef.current = null;
    pendingDashboardPatternRef.current = null;
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
    suggestionQueue: activeSuggestions,
    dashboardBuilderOpen,
    dashboardBuilderSuggestion,
    workflowBuilderOpen,
    workflowBuilderSuggestion,
    submitQuery,
    selectConversation,
    newConversation,
    setActiveCategory,
    setHistorySearch,
    onThinkingComplete,
    handleSuggestionPrimary,
    handleSuggestionDismiss,
    closeDashboardBuilder,
    confirmDashboardCreation,
    closeWorkflowBuilder,
    confirmWorkflowCreation,
    togglePin,
    toggleFavorite,
    handleAction,
  };
}
