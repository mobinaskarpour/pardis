import type {
  ConditionOperator,
  ScheduleFrequency,
  TriggerType,
  WorkflowActionType,
} from "@/types/workflow";

export interface Option<T extends string = string> {
  id: T;
  label: string;
}

export const triggerTypes: Option<TriggerType>[] = [
  { id: "schedule", label: "زمان‌بندی" },
  { id: "event", label: "رویداد" },
  { id: "manual", label: "اجرای دستی" },
];

export const scheduleFrequencies: Option<ScheduleFrequency>[] = [
  { id: "daily", label: "هر روز" },
  { id: "weekly", label: "هر هفته" },
  { id: "interval", label: "بازه زمانی" },
];

export const triggerEvents: Option[] = [
  { id: "new-ct-scan", label: "ثبت اسکن CT جدید" },
  { id: "contrast-appointment", label: "ثبت نوبت CT با ماده حاجب" },
  { id: "no-show", label: "عدم مراجعه بیمار" },
  { id: "qc-failed", label: "خطای تست QC دستگاه" },
  { id: "report-ready", label: "آماده شدن گزارش رادیولوژیست" },
];

export const conditionFields: Option[] = [
  { id: "scan-type", label: "نوع اسکن" },
  { id: "contrast", label: "ماده حاجب" },
  { id: "dose", label: "دوز بیمار (mSv)" },
  { id: "report-wait", label: "زمان انتظار گزارش (ساعت)" },
  { id: "qc-result", label: "نتیجه تست QC" },
  { id: "scan-count", label: "تعداد اسکن امروز" },
  { id: "patient-age", label: "سن بیمار" },
  { id: "allergy-history", label: "سابقه آلرژی" },
];

export const conditionOperators: Option<ConditionOperator>[] = [
  { id: "eq", label: "برابر با" },
  { id: "neq", label: "مخالف با" },
  { id: "gt", label: "بزرگ‌تر از" },
  { id: "lt", label: "کمتر از" },
  { id: "contains", label: "شامل" },
];

export const actionTypes: Option<WorkflowActionType>[] = [
  { id: "send-sms", label: "ارسال پیامک" },
  { id: "send-email", label: "ارسال ایمیل" },
  { id: "notify", label: "اعلان داخلی" },
  { id: "create-task", label: "ایجاد وظیفه" },
  { id: "generate-report", label: "تولید گزارش" },
  { id: "archive", label: "آرشیو در PACS" },
];

export const recipients: Option[] = [
  { id: "health-physics", label: "واحد فیزیک بهداشت" },
  { id: "radiologist-oncall", label: "رادیولوژیست کشیک" },
  { id: "ct-tech", label: "تکنسین CT" },
  { id: "nurse", label: "پرستار بخش" },
  { id: "ct-manager", label: "مدیر بخش سی‌تی" },
  { id: "ceo", label: "مدیرعامل" },
  { id: "equip-engineer", label: "مهندس تجهیزات" },
  { id: "patient", label: "بیمار" },
];

export function optionLabel(options: Option[], id?: string): string {
  return options.find((o) => o.id === id)?.label ?? id ?? "—";
}
