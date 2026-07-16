export type WorkflowStatus = "active" | "warning" | "error" | "paused";
export type WorkflowHealth = "ok" | "warning" | "error";
export type WorkflowSource = "ai" | "manual";

export type WorkflowCategoryId =
  | "patient-ops"
  | "imaging"
  | "finance-insurance"
  | "ai"
  | "automation"
  | "analytics";

export type TriggerType = "schedule" | "event" | "manual";
export type ScheduleFrequency = "daily" | "weekly" | "interval";

export type ConditionOperator = "eq" | "neq" | "gt" | "lt" | "contains";

export type WorkflowActionType =
  | "send-sms"
  | "send-email"
  | "notify"
  | "create-task"
  | "generate-report"
  | "archive";

export interface WorkflowTrigger {
  type: TriggerType;
  frequency?: ScheduleFrequency;
  time?: string;
  intervalMinutes?: number;
  event?: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string;
}

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  recipient?: string;
  message?: string;
}

export interface WorkflowRun {
  id: string;
  time: string;
  status: "success" | "failed";
  detail?: string;
}

export interface WorkflowApproval {
  role: string;
  name?: string;
  required: boolean;
}

export interface WorkflowPerformance {
  avgDuration: string;
  timeSaved: string;
  estimatedROI: string;
}

export type WidgetVizType =
  | "live-counter"
  | "tiny-trend"
  | "circular-health"
  | "progress-wave"
  | "mini-timeline"
  | "execution-pulse"
  | "heatmap"
  | "relationship";

export type WidgetAnalyticsSection =
  | "performance"
  | "execution"
  | "widgets"
  | "optimizations"
  | "canvas";

export interface WorkflowDashboardWidget {
  id: string;
  label: string;
  value: string;
  trend?: string;
  vizType?: WidgetVizType;
  /** Numeric value for live counter animations */
  numericValue?: number;
  /** 0–100 health score for circular indicators */
  healthScore?: number;
  /** Sparkline points for tiny trend graphs */
  sparkline?: number[];
  /** Timeline events for mini timelines */
  timeline?: { time: string; label: string }[];
  /** Heatmap cells 0–1 intensity */
  heatmap?: number[];
  /** Related entity labels for relationship charts */
  related?: { label: string; value: number }[];
  /** Which section to scroll to on workflow detail */
  analyticsSection?: WidgetAnalyticsSection;
}

export interface WorkflowConversationOrigin {
  detectedAt: string;
  repeatCount: number;
  repeatPeriodDays: number;
  sampleQueries: string[];
  conversationExcerpt?: string;
}

export interface WorkflowOptimization {
  id: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  health: WorkflowHealth;
  source: WorkflowSource;
  category: WorkflowCategoryId;
  executiveSummary: string;
  /** For AI-created workflows: the detected pattern it was built from */
  createdFrom?: string;
  whyAICreated?: string;
  conversationOrigin?: WorkflowConversationOrigin;
  automationScore: number;
  connectedSystems: string[];
  approvals: WorkflowApproval[];
  performance: WorkflowPerformance;
  dashboardWidgets: WorkflowDashboardWidget[];
  aiOptimizations: WorkflowOptimization[];
  previewSteps: string[];
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  lastRun: string;
  runsToday: number;
  successRate: number;
  issue?: string;
  runs: WorkflowRun[];
}

export function workflowStatus(wf: Workflow): WorkflowStatus {
  if (!wf.enabled) return "paused";
  if (wf.health === "error") return "error";
  if (wf.health === "warning") return "warning";
  return "active";
}
