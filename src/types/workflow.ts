export type WorkflowStatus = "active" | "warning" | "error" | "paused";
export type WorkflowHealth = "ok" | "warning" | "error";
export type WorkflowSource = "ai" | "manual";

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
  /** schedule */
  frequency?: ScheduleFrequency;
  time?: string;
  intervalMinutes?: number;
  /** event — id from triggerEvents */
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

export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  health: WorkflowHealth;
  source: WorkflowSource;
  /** For AI-created workflows: the detected pattern it was built from */
  createdFrom?: string;
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
