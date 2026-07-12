export interface ModuleQuickAction {
  label: string;
  href?: string;
}

export interface ModuleMeta {
  id: string;
  title: string;
  subtitle: string;
  aiSummary: string;
  suggestions: string[];
  quickActions: ModuleQuickAction[];
}

export type ModuleId =
  | "patients"
  | "doctors"
  | "imaging"
  | "appointments"
  | "reports"
  | "analytics"
  | "knowledge"
  | "workflows"
  | "automation"
  | "financial"
  | "notifications"
  | "integrations"
  | "settings";
