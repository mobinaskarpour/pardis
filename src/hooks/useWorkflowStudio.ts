"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CanvasEdge,
  CanvasNode,
  Collaborator,
  SaveStatus,
  StudioGraph,
  StudioLog,
  StudioVersion,
  StudioViewport,
  StudioWarning,
} from "@/types/workflow-studio";
import type { Workflow } from "@/types/workflow";
import { useWorkflowStore } from "@/store/workflow-store";
import {
  analyzeWarnings,
  buildAIGeneratedGraph,
  generateStudioId,
  workflowToGraph,
} from "@/lib/workflow-studio-utils";

interface HistoryEntry {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const collaborators: Collaborator[] = [
  { id: "1", name: "Mobin", role: "editing", color: "#5b5fc7" },
  { id: "2", name: "دکتر اخلاق‌پور", role: "viewing", color: "#4da8a8" },
  { id: "3", name: "THE MACHINE", role: "reviewing", color: "#10a37f" },
];

export function useWorkflowStudio(workflowId: string) {
  const workflow = useWorkflowStore((s) =>
    s.workflows.find((w) => w.id === workflowId)
  );
  const updateWorkflow = useWorkflowStore((s) => s.updateWorkflow);

  const [graph, setGraph] = useState<StudioGraph | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<StudioLog[]>([]);
  const [versions, setVersions] = useState<StudioVersion[]>([
    { id: "v3", label: "نسخه ۳ — افزودن ایمیل PDF", time: "۱۰:۲۲", author: "Mobin" },
    { id: "v2", label: "نسخه ۲ — شرط VIP", time: "دیروز", author: "Mobin" },
    { id: "v1", label: "نسخه ۱ — ایجاد اولیه", time: "۳ روز پیش", author: "AI" },
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [timelineTab, setTimelineTab] = useState<
    "logs" | "performance" | "errors" | "history"
  >("logs");
  const [bottomOpen, setBottomOpen] = useState(false);
  const initRef = useRef<string | null>(null);

  useEffect(() => {
    if (!workflow) {
      setGraph(null);
      return;
    }
    if (initRef.current === workflowId) return;
    initRef.current = workflowId;

    const g = workflowToGraph(workflow);
    setGraph(g);
    setSelectedId(null);
    setHistory([
      {
        nodes: structuredClone(g.nodes),
        edges: structuredClone(g.edges),
      },
    ]);
    setHistoryIndex(0);
    setLogs([
      {
        id: "l1",
        time: "۱۰:۳۰:۰۱",
        level: "info",
        message: "Workflow Studio آماده",
      },
    ]);
  }, [workflow, workflowId]);

  const pushHistory = useCallback(
    (nodes: CanvasNode[], edges: CanvasEdge[]) => {
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        next.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
        if (next.length > 40) next.shift();
        return next;
      });
      setHistoryIndex((i) => Math.min(i + 1, 39));
    },
    [historyIndex]
  );

  const markDirty = useCallback(() => setSaveStatus("unsaved"), []);

  const updateGraph = useCallback(
    (patch: Partial<StudioGraph>, recordHistory = true) => {
      setGraph((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        if (recordHistory) pushHistory(next.nodes, next.edges);
        return next;
      });
      markDirty();
    },
    [pushHistory, markDirty]
  );

  const setViewport = useCallback(
    (viewport: StudioViewport) => {
      setGraph((prev) => (prev ? { ...prev, viewport } : prev));
    },
    []
  );

  const addNode = useCallback(
    (defId: string, x?: number, y?: number) => {
      if (!graph) return;
      const node: CanvasNode = {
        id: generateStudioId(),
        defId,
        x: x ?? 200 - graph.viewport.x / graph.viewport.zoom,
        y: y ?? 200 - graph.viewport.y / graph.viewport.zoom,
        config: {},
        status: "idle",
      };
      updateGraph({ nodes: [...graph.nodes, node], edges: graph.edges });
      setSelectedId(node.id);
      setLogs((l) => [
        ...l,
        {
          id: generateStudioId("log"),
          time: new Date().toLocaleTimeString("fa-IR"),
          level: "info",
          message: `گره «${defId}» اضافه شد`,
          nodeId: node.id,
        },
      ]);
    },
    [graph, updateGraph]
  );

  const moveNode = useCallback(
    (id: string, x: number, y: number) => {
      if (!graph) return;
      updateGraph(
        {
          nodes: graph.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
          edges: graph.edges,
        },
        false
      );
    },
    [graph, updateGraph]
  );

  const commitMove = useCallback(() => {
    if (graph) pushHistory(graph.nodes, graph.edges);
    markDirty();
  }, [graph, pushHistory, markDirty]);

  const updateNodeConfig = useCallback(
    (id: string, config: Record<string, string>) => {
      if (!graph) return;
      updateGraph({
        nodes: graph.nodes.map((n) =>
          n.id === id ? { ...n, config: { ...n.config, ...config } } : n
        ),
        edges: graph.edges,
      });
    },
    [graph, updateGraph]
  );

  const deleteNode = useCallback(
    (id: string) => {
      if (!graph) return;
      updateGraph({
        nodes: graph.nodes.filter((n) => n.id !== id),
        edges: graph.edges.filter((e) => e.from !== id && e.to !== id),
      });
      if (selectedId === id) setSelectedId(null);
    },
    [graph, updateGraph, selectedId]
  );

  const connectNodes = useCallback(
    (from: string, to: string) => {
      if (!graph || from === to) return;
      const exists = graph.edges.some((e) => e.from === from && e.to === to);
      if (exists) return;
      updateGraph({
        nodes: graph.nodes,
        edges: [
          ...graph.edges,
          { id: generateStudioId("e"), from, to, fromPort: 0, toPort: 0 },
        ],
      });
    },
    [graph, updateGraph]
  );

  const save = useCallback(() => {
    if (!workflow || !graph) return;
    setSaveStatus("saving");
    setTimeout(() => {
      updateWorkflow(workflow.id, {
        name: workflow.name,
        description: workflow.description,
      });
      setVersions((v) => [
        {
          id: generateStudioId("v"),
          label: `نسخه ${v.length + 1}`,
          time: "همین الان",
          author: "Mobin",
        },
        ...v,
      ]);
      setSaveStatus("saved");
      setLogs((l) => [
        ...l,
        {
          id: generateStudioId("log"),
          time: new Date().toLocaleTimeString("fa-IR"),
          level: "success",
          message: "Workflow ذخیره شد",
        },
      ]);
    }, 600);
  }, [workflow, graph, updateWorkflow]);

  const undo = useCallback(() => {
    if (historyIndex <= 0 || !graph) return;
    const entry = history[historyIndex - 1];
    setHistoryIndex((i) => i - 1);
    setGraph((prev) =>
      prev
        ? { ...prev, nodes: entry.nodes, edges: entry.edges }
        : prev
    );
    markDirty();
  }, [history, historyIndex, graph, markDirty]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !graph) return;
    const entry = history[historyIndex + 1];
    setHistoryIndex((i) => i + 1);
    setGraph((prev) =>
      prev
        ? { ...prev, nodes: entry.nodes, edges: entry.edges }
        : prev
    );
    markDirty();
  }, [history, historyIndex, graph, markDirty]);

  const warnings = useMemo(
    () => (graph ? analyzeWarnings(graph.nodes, graph.edges) : []),
    [graph]
  );

  const selectedNode = useMemo(
    () => graph?.nodes.find((n) => n.id === selectedId) ?? null,
    [graph, selectedId]
  );

  const runTest = useCallback(async () => {
    if (!graph || isRunning) return;
    setIsRunning(true);
    setBottomOpen(true);
    setTimelineTab("logs");
    setLogs((l) => [
      ...l,
      {
        id: generateStudioId("log"),
        time: new Date().toLocaleTimeString("fa-IR"),
        level: "info",
        message: "▶ اجرای تست شروع شد",
      },
    ]);

    setViewport({ ...graph.viewport, zoom: 0.75 });

    const order = topologicalSort(graph.nodes, graph.edges);

    for (let i = 0; i < order.length; i++) {
      const nodeId = order[i];
      setGraph((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: prev.nodes.map((n) =>
            n.id === nodeId
              ? { ...n, status: "running" as const }
              : n
          ),
        };
      });

      await delay(700);

      const isError = graph.nodes.find((n) => n.id === nodeId)?.defId === "condition" &&
        Math.random() > 0.9;

      setGraph((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: prev.nodes.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  status: (isError ? "error" : "success") as CanvasNode["status"],
                  executionTime: `${Math.floor(Math.random() * 400 + 80)}ms`,
                }
              : n
          ),
        };
      });

      setLogs((l) => [
        ...l,
        {
          id: generateStudioId("log"),
          time: new Date().toLocaleTimeString("fa-IR"),
          level: isError ? "error" : "success",
          message: isError
            ? `خطا در گره ${nodeId.slice(0, 6)}`
            : `گره ${nodeId.slice(0, 6)} با موفقیت اجرا شد`,
          nodeId,
        },
      ]);
    }

    setIsRunning(false);
    setLogs((l) => [
      ...l,
      {
        id: generateStudioId("log"),
        time: new Date().toLocaleTimeString("fa-IR"),
        level: "success",
        message: "✓ اجرای تست تکمیل شد",
      },
    ]);
  }, [graph, isRunning, setViewport]);

  const generateWithAI = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGraph({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 0.85 } });
    setLogs([
      {
        id: generateStudioId("log"),
        time: new Date().toLocaleTimeString("fa-IR"),
        level: "info",
        message: "✨ THE MACHINE در حال ساخت Workflow...",
      },
    ]);

    const full = buildAIGeneratedGraph();
    for (let i = 0; i < full.nodes.length; i++) {
      await delay(500);
      const node = full.nodes[i];
      setGraph((prev) => ({
        nodes: [...(prev?.nodes ?? []), node],
        edges: prev?.edges ?? [],
        viewport: full.viewport,
      }));
      setLogs((l) => [
        ...l,
        {
          id: generateStudioId("log"),
          time: new Date().toLocaleTimeString("fa-IR"),
          level: "info",
          message: `گره «${node.defId}» ایجاد شد`,
          nodeId: node.id,
        },
      ]);
    }

    for (let i = 0; i < full.edges.length; i++) {
      await delay(300);
      const edge = full.edges[i];
      setGraph((prev) =>
        prev
          ? { ...prev, edges: [...prev.edges, edge] }
          : prev
      );
    }

    setIsGenerating(false);
    markDirty();
    setLogs((l) => [
      ...l,
      {
        id: generateStudioId("log"),
        time: new Date().toLocaleTimeString("fa-IR"),
        level: "success",
        message: "✓ Workflow با AI ساخته شد",
      },
    ]);
  }, [isGenerating, markDirty]);

  const restoreVersion = useCallback(
    (versionId: string) => {
      if (!graph) return;
      const g = buildAIGeneratedGraph();
      updateGraph(g);
      setLogs((l) => [
        ...l,
        {
          id: generateStudioId("log"),
          time: new Date().toLocaleTimeString("fa-IR"),
          level: "info",
          message: `بازگردانی ${versionId}`,
        },
      ]);
    },
    [graph, updateGraph]
  );

  return {
    workflow,
    graph,
    selectedId,
    selectedNode,
    setSelectedId,
    saveStatus,
    isRunning,
    isGenerating,
    logs,
    versions,
    warnings,
    collaborators,
    timelineTab,
    setTimelineTab,
    bottomOpen,
    setBottomOpen,
    addNode,
    moveNode,
    commitMove,
    updateNodeConfig,
    deleteNode,
    connectNodes,
    setViewport,
    save,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    runTest,
    generateWithAI,
    restoreVersion,
    updateWorkflow,
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function topologicalSort(
  nodes: CanvasNode[],
  edges: CanvasEdge[]
): string[] {
  const inDeg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of nodes) {
    inDeg.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
  }
  const queue = nodes.filter((n) => (inDeg.get(n.id) ?? 0) === 0).map((n) => n.id);
  const result: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    result.push(id);
    for (const next of adj.get(id) ?? []) {
      inDeg.set(next, (inDeg.get(next) ?? 1) - 1);
      if (inDeg.get(next) === 0) queue.push(next);
    }
  }
  return result.length ? result : nodes.map((n) => n.id);
}
