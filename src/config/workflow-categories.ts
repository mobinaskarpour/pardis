/** Workflow categories for پردیس نور imaging center */
export type WorkflowCategoryId =
  | "patient-ops"
  | "imaging"
  | "finance-insurance"
  | "ai"
  | "automation"
  | "analytics";

export interface WorkflowCategory {
  id: WorkflowCategoryId;
  emoji: string;
  label: string;
}

export const workflowCategories: WorkflowCategory[] = [
  { id: "patient-ops", emoji: "🏥", label: "عملیات بیماران" },
  { id: "imaging", emoji: "🩻", label: "تصویربرداری" },
  { id: "finance-insurance", emoji: "💳", label: "مالی و بیمه" },
  { id: "ai", emoji: "🤖", label: "هوش مصنوعی" },
  { id: "automation", emoji: "⚙️", label: "اتوماسیون" },
  { id: "analytics", emoji: "📈", label: "تحلیل و گزارش" },
];

export function getCategoryLabel(id: WorkflowCategoryId): string {
  return workflowCategories.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryEmoji(id: WorkflowCategoryId): string {
  return workflowCategories.find((c) => c.id === id)?.emoji ?? "⚙️";
}
