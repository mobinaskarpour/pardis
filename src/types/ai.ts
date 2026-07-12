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

export interface WorkspaceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  canvas?: CanvasType;
  reasoning?: string[];
  citations?: Citation[];
  suggestedQuestions?: string[];
  actions?: AIAction[];
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
