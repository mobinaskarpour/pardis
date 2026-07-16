export type NodeCategory =
  | "medical"
  | "ai"
  | "communication"
  | "documents"
  | "automation"
  | "financial"
  | "patient"
  | "scheduling"
  | "analytics"
  | "security";

export type NodeRunStatus =
  | "idle"
  | "running"
  | "success"
  | "warning"
  | "error";

export interface NodeDefinition {
  id: string;
  category: NodeCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
}

export interface CanvasNode {
  id: string;
  defId: string;
  x: number;
  y: number;
  config: Record<string, string>;
  status: NodeRunStatus;
  executionTime?: string;
}

export interface CanvasEdge {
  id: string;
  from: string;
  to: string;
  fromPort: number;
  toPort: number;
}

export interface StudioViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface StudioGraph {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: StudioViewport;
}

export interface StudioVersion {
  id: string;
  label: string;
  time: string;
  author: string;
}

export interface StudioLog {
  id: string;
  time: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  nodeId?: string;
}

export interface StudioWarning {
  id: string;
  type: "error" | "warning";
  message: string;
  nodeId?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: "editing" | "viewing" | "reviewing";
  color: string;
}

export type SaveStatus = "saved" | "saving" | "unsaved";
