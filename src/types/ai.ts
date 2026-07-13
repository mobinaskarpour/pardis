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

export interface WorkflowSuggestion {
  status: "pending" | "accepted" | "dismissed";
  /** Why the AI is suggesting it — the detected pattern */
  reason: string;
  workflowId: string;
  workflowName: string;
  triggerLabel: string;
  actionLabels: string[];
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
  /** Present when the AI detected a repeated task and proposes automating it */
  workflowSuggestion?: WorkflowSuggestion;
}

export interface Conversation {
  id: string;
  title: string;
  category: HistoryCategory;
  preview: string;
  messages: WorkspaceMessage[];
  updatedAt: string;
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
}

export interface AIContextState {
  activeConversationId: string | null;
  canvasType: CanvasType;
  isThinking: boolean;
}
