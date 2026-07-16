export type HistoryCategory =
  | "patients"
  | "reports"
  | "financial"
  | "workflow"
  | "sessions";

export type CanvasType =
  | "welcome"
  | "patient"
  | "revenue"
  | "patients-today"
  | "mri-ready"
  | "workflow"
  | "report";

export interface Citation {
  id: string;
  source: string;
  label: string;
}

export interface AIAction {
  id: string;
  label: string;
  icon?: string;
}

export type ResponseFormat =
  | "answer"
  | "timeline"
  | "workflow"
  | "chart"
  | "executive-summary"
  | "dashboard"
  | "document"
  | "medical-report"
  | "task-list";

export type HistoryTimeGroup = "today" | "yesterday" | "week" | "earlier";

export type WorkflowGenerationPhase =
  | "analyzing"
  | "building"
  | "connecting"
  | "dashboard"
  | "complete";

export interface DashboardGeneration {
  status: "generating" | "complete";
  widgets: string[];
}

export interface WorkflowSuggestion {
  status: "pending" | "generating" | "accepted" | "dismissed";
  /** Why the AI is suggesting it — the detected pattern */
  reason: string;
  workflowId: string;
  workflowName: string;
  dashboardName: string;
  dashboardWidgets: string[];
  connectedSystems: string[];
  triggerLabel: string;
  actionLabels: string[];
  repeatCount: number;
  generationPhase?: WorkflowGenerationPhase;
}

export interface WorkspaceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  canvas?: CanvasType;
  reasoning?: string[];
  citations?: Citation[];
  suggestedQuestions?: string[];
  actions?: AIAction[];
  workflowSuggestion?: WorkflowSuggestion;
  memoryContext?: string;
  responseFormat?: ResponseFormat;
  dashboardGeneration?: DashboardGeneration;
}

export interface Conversation {
  id: string;
  title: string;
  category: HistoryCategory;
  preview: string;
  messages: WorkspaceMessage[];
  updatedAt: string;
  pinned?: boolean;
  favorite?: boolean;
  timeGroup?: HistoryTimeGroup;
}

export interface AIResponse {
  content: string;
  canvas: CanvasType;
  reasoning: string[];
  citations: Citation[];
  suggestedQuestions: string[];
  actions: AIAction[];
  conversationTitle?: string;
  category?: HistoryCategory;
  memoryContext?: string;
  responseFormat?: ResponseFormat;
  thinkingSteps?: string[];
}

export interface AIContextState {
  activeConversationId: string | null;
  canvasType: CanvasType;
  isThinking: boolean;
}
