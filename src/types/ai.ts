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

/** Unified AI suggestion queue — unlimited simultaneous cards */
export type AISuggestionType =
  | "workflow"
  | "dashboard"
  | "automation"
  | "report"
  | "reminder"
  | "alert";

export type AISuggestionStatus =
  | "pending"
  | "preview"
  | "generating"
  | "accepted"
  | "dismissed";

export interface AISuggestionBase {
  id: string;
  type: AISuggestionType;
  status: AISuggestionStatus;
  title: string;
  subtitle: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  conversationId: string;
  messageId?: string;
  createdAt: number;
}

export interface WorkflowQueueSuggestion extends AISuggestionBase {
  type: "workflow";
  workflowId: string;
  workflowName: string;
  dashboardName: string;
  dashboardWidgets: string[];
  connectedSystems: string[];
  triggerLabel: string;
  actionLabels: string[];
  repeatCount: number;
  reason: string;
  generationPhase?: WorkflowGenerationPhase;
}

export interface DashboardQueueSuggestion extends AISuggestionBase {
  type: "dashboard";
  dashboardId: string;
  dashboardName: string;
  scenarioName: string;
  widgets: DashboardSuggestionWidget[];
  widgetCount: number;
  reason: string;
  generationPhase?: DashboardGenerationPhase;
}

export interface GenericQueueSuggestion extends AISuggestionBase {
  type: "automation" | "report" | "reminder" | "alert";
  detail?: string;
}

export type AISuggestion =
  | WorkflowQueueSuggestion
  | DashboardQueueSuggestion
  | GenericQueueSuggestion;

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

export type DashboardGenerationPhase =
  | "analyzing"
  | "selecting"
  | "building"
  | "complete";

export interface DashboardSuggestionWidget {
  id: string;
  label: string;
  value: string;
  delta?: string;
  description?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  sparkline?: number[];
}

export interface DashboardSuggestion {
  status: "pending" | "preview" | "generating" | "accepted" | "dismissed";
  reason: string;
  dashboardId: string;
  dashboardName: string;
  scenarioName: string;
  widgets: DashboardSuggestionWidget[];
  widgetCount: number;
  generationPhase?: DashboardGenerationPhase;
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
  /** @deprecated Prefer AI suggestion queue */
  workflowSuggestion?: WorkflowSuggestion;
  /** @deprecated Prefer AI suggestion queue */
  dashboardSuggestion?: DashboardSuggestion;
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
