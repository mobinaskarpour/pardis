import type {
  CanvasEdge,
  CanvasNode,
  StudioGraph,
  StudioViewport,
  StudioWarning,
} from "@/types/workflow-studio";
import type { Workflow } from "@/types/workflow";
import { getNodeDef } from "@/config/workflow-nodes";

export const NODE_W = 248;
export const NODE_H = 112;
const GAP_X = 100;

export function generateStudioId(prefix = "n"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** RTL flow: trigger on the right, actions flow leftward */
export function workflowToGraph(wf: Workflow): StudioGraph {
  const nodes: CanvasNode[] = [];
  const edges: CanvasEdge[] = [];
  const y = 240;

  const triggerDef =
    wf.trigger.type === "schedule"
      ? "schedule-trigger"
      : wf.trigger.type === "event"
        ? wf.trigger.event === "report-ready"
          ? "report-ready"
          : wf.trigger.event === "no-show"
            ? "patient-checked-in"
            : "mri-completed"
        : "patient-registered";

  const chain: { defId: string; config?: Record<string, string> }[] = [
    { defId: triggerDef },
  ];

  for (const cond of wf.conditions) {
    chain.push({
      defId: "condition",
      config: {
        field: cond.field,
        operator: cond.operator,
        value: cond.value,
      },
    });
  }

  for (const action of wf.actions) {
    const defId =
      action.type === "send-sms"
        ? "sms"
        : action.type === "send-email"
          ? "email"
          : action.type === "notify"
            ? "notification"
            : action.type === "generate-report"
              ? "generate-report"
              : action.type === "create-task"
                ? "patient-notify"
                : "archive-doc";
    chain.push({
      defId,
      config: {
        recipient: action.recipient ?? "",
        message: action.message ?? "",
      },
    });
  }

  let prevId: string | null = null;
  const count = chain.length;
  const totalW = count * NODE_W + Math.max(0, count - 1) * GAP_X;
  const startX = 120;
  const rightmostX = startX + totalW - NODE_W;

  for (let i = 0; i < chain.length; i++) {
    const item = chain[i];
    const x = rightmostX - i * (NODE_W + GAP_X);
    const id = generateStudioId();
    nodes.push({
      id,
      defId: item.defId,
      x,
      y,
      config: item.config ?? {},
      status: "idle",
    });
    if (prevId) {
      edges.push({
        id: generateStudioId("e"),
        from: prevId,
        to: id,
        fromPort: 0,
        toPort: 0,
      });
    }
    prevId = id;
  }

  return {
    nodes,
    edges,
    viewport: computeFitViewport(nodes, 960, 640),
  };
}

/** Output = left edge, Input = right edge (RTL canvas flow) */
export function getPortPosition(
  node: CanvasNode,
  _port: number,
  type: "input" | "output"
): { x: number; y: number } {
  const py = node.y + NODE_H / 2;
  const px = type === "output" ? node.x : node.x + NODE_W;
  return { x: px, y: py };
}

export function bezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dist = Math.abs(x2 - x1);
  if (dist < 2) return `M ${x1} ${y1} L ${x2} ${y2}`;

  const cp = Math.min(dist * 0.45, 72);
  if (x1 > x2) {
    const c1x = x1 - cp;
    const c2x = x2 + cp;
    return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
  }

  const c1x = x1 + cp;
  const c2x = x2 - cp;
  return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
}

/** Bounding box for SVG connection layer (canvas coordinates) */
export function getGraphBounds(nodes: CanvasNode[]): {
  width: number;
  height: number;
} {
  if (nodes.length === 0) return { width: 1, height: 1 };
  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W)) + 120;
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H)) + 120;
  return { width: maxX, height: maxY };
}

export function computeFitViewport(
  nodes: CanvasNode[],
  containerWidth: number,
  containerHeight: number
): StudioViewport {
  if (nodes.length === 0) return { x: 40, y: 40, zoom: 1 };

  const minX = Math.min(...nodes.map((n) => n.x)) - 80;
  const minY = Math.min(...nodes.map((n) => n.y)) - 80;
  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W)) + 80;
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H)) + 80;
  const graphW = maxX - minX;
  const graphH = maxY - minY;

  const zoom = Math.min(
    (containerWidth - 100) / graphW,
    (containerHeight - 100) / graphH,
    1.2
  );
  const z = Math.max(0.25, Math.min(zoom, 1.2));

  return {
    x: (containerWidth - graphW * z) / 2 - minX * z,
    y: (containerHeight - graphH * z) / 2 - minY * z,
    zoom: z,
  };
}

export function analyzeWarnings(
  nodes: CanvasNode[],
  edges: CanvasEdge[]
): StudioWarning[] {
  const warnings: StudioWarning[] = [];
  const outCount = new Map<string, number>();
  const inCount = new Map<string, number>();

  for (const e of edges) {
    outCount.set(e.from, (outCount.get(e.from) ?? 0) + 1);
    inCount.set(e.to, (inCount.get(e.to) ?? 0) + 1);
  }

  for (const node of nodes) {
    const def = getNodeDef(node.defId);
    if (!def) continue;

    if (def.outputs > 0 && !outCount.has(node.id)) {
      warnings.push({
        id: `w-out-${node.id}`,
        type: "warning",
        message: "این گره خروجی ندارد.",
        nodeId: node.id,
      });
    }

    if (def.inputs > 0 && !inCount.has(node.id)) {
      warnings.push({
        id: `w-in-${node.id}`,
        type: "warning",
        message: "این گره ورودی ندارد.",
        nodeId: node.id,
      });
    }
  }

  const reachable = new Set<string>();
  const triggers = nodes.filter((n) => (getNodeDef(n.defId)?.inputs ?? 0) === 0);
  const queue = triggers.map((t) => t.id);
  while (queue.length) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const e of edges.filter((ed) => ed.from === id)) {
      queue.push(e.to);
    }
  }

  for (const node of nodes) {
    if (!reachable.has(node.id) && (getNodeDef(node.defId)?.inputs ?? 0) > 0) {
      warnings.push({
        id: `w-dead-${node.id}`,
        type: "error",
        message: "این شاخه هرگز اجرا نمی‌شود.",
        nodeId: node.id,
      });
    }
  }

  return warnings;
}

export const AI_GENERATED_FLOW: {
  defId: string;
  config?: Record<string, string>;
}[] = [
  { defId: "report-ready" },
  { defId: "ai-decision", config: { prompt: "بررسی آماده بودن گزارش MRI" } },
  { defId: "sms", config: { message: "گزارش MRI شما آماده است." } },
  { defId: "pdf-generate", config: { template: "mri-report" } },
  { defId: "email", config: { subject: "گزارش MRI", attach: "pdf" } },
];

export function buildAIGeneratedGraph(): StudioGraph {
  const nodes: CanvasNode[] = [];
  const edges: CanvasEdge[] = [];
  const y = 240;
  let prevId: string | null = null;

  const count = AI_GENERATED_FLOW.length;
  const totalW = count * NODE_W + Math.max(0, count - 1) * GAP_X;
  const rightmostX = 120 + totalW - NODE_W;

  for (let i = 0; i < AI_GENERATED_FLOW.length; i++) {
    const item = AI_GENERATED_FLOW[i];
    const x = rightmostX - i * (NODE_W + GAP_X);
    const id = generateStudioId("ai");
    nodes.push({
      id,
      defId: item.defId,
      x,
      y,
      config: item.config ?? {},
      status: "idle",
    });
    if (prevId) {
      edges.push({
        id: generateStudioId("e"),
        from: prevId,
        to: id,
        fromPort: 0,
        toPort: 0,
      });
    }
    prevId = id;
  }

  return { nodes, edges, viewport: computeFitViewport(nodes, 960, 640) };
}
