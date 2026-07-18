import type { WorkflowSuggestion } from "@/types/ai";
import type { Workflow } from "@/types/workflow";
import { imagingWorkflowsSeed } from "@/mock/data/workflow-scenarios";
import { triggerLabelFor } from "@/lib/workflow-detection";
import { optionLabel, actionTypes } from "@/config/workflow-options";
import { toPersianDigits } from "@/lib/persian";

export interface DemoWorkflowPattern {
  id: string;
  /** Match user query (substring) */
  queries: string[];
  workflowId: string;
  workflowName: string;
  dashboardName: string;
  dashboardWidgets: string[];
  connectedSystems: string[];
  repeatCount: number;
}

export const demoWorkflowPatterns: DemoWorkflowPattern[] = [
  {
    id: "mri-ready",
    queries: [
      "گزارش‌های mri",
      "mri آماده",
      "گزارش mri",
      "آماده‌سازی و تأیید mri",
      "آماده‌سازی و تأیید گزارش mri",
      "تأیید گزارش mri",
      "mri امروز",
    ],
    workflowId: "wf-mri-report-prep",
    workflowName: "آماده‌سازی و تأیید MRI",
    dashboardName: "داشبورد MRI امروز",
    dashboardWidgets: [
      "گزارش‌های امروز",
      "میانگین زمان گزارش",
      "گزارش‌های معطل",
      "عملکرد پزشکان",
      "روند هفتگی",
    ],
    connectedSystems: ["PACS", "DICOM", "Email", "SMS"],
    repeatCount: 37,
  },
  {
    id: "appointments",
    queries: [
      "نوبت‌های امروز",
      "وضعیت نوبت",
      "نوبت امروز",
      "نوبت‌های فردا",
      "مدیریت نوبت‌های فردا",
      "نوبت فردا",
      "ظرفیت فردا",
    ],
    workflowId: "wf-tomorrow-appointments",
    workflowName: "مدیریت نوبت‌های فردا",
    dashboardName: "داشبورد نوبت‌دهی",
    dashboardWidgets: [
      "نوبت‌های امروز",
      "نوبت‌های لغوشده",
      "ظرفیت دستگاه‌ها",
      "زمان انتظار",
    ],
    connectedSystems: ["Calendar", "SMS", "WhatsApp", "Appointment System"],
    repeatCount: 28,
  },
  {
    id: "insurance",
    queries: [
      "وضعیت بیمه",
      "بیمه بیمار",
      "مطالبات بیمه",
      "بررسی و پیگیری بیمه",
      "پیگیری بیمه",
      "پرونده بیمه",
    ],
    workflowId: "wf-insurance-check",
    workflowName: "بررسی و پیگیری بیمه",
    dashboardName: "داشبورد بیمه",
    dashboardWidgets: [
      "درخواست‌های بیمه",
      "بیمه‌های تأیید شده",
      "رد شده",
      "زمان پاسخ",
    ],
    connectedSystems: ["Insurance API", "Accounting", "SMS"],
    repeatCount: 31,
  },
  {
    id: "auto-results",
    queries: ["ارسال نتیجه", "ارسال نتایج", "پیامک نتیجه", "نتایج بیمار"],
    workflowId: "wf-auto-results",
    workflowName: "ارسال خودکار نتایج بیماران",
    dashboardName: "داشبورد ارسال نتایج",
    dashboardWidgets: [
      "پیامک‌های ارسال شده",
      "ایمیل‌های ارسال شده",
      "نرخ مشاهده",
    ],
    connectedSystems: ["SMS", "Email", "WhatsApp", "PACS"],
    repeatCount: 24,
  },
  {
    id: "devices",
    queries: [
      "وضعیت دستگاه",
      "دستگاه‌های تصویر",
      "سلامت mri",
      "سلامت ct",
      "وضعیت دستگاه‌های تصویربرداری",
    ],
    workflowId: "wf-device-health",
    workflowName: "پایش سلامت تجهیزات",
    dashboardName: "داشبورد تجهیزات",
    dashboardWidgets: ["سلامت MRI", "سلامت CT", "وضعیت QC", "تعمیرات"],
    connectedSystems: ["IoT", "PACS", "Maintenance", "SMS"],
    repeatCount: 19,
  },
  {
    id: "delayed-reports",
    queries: ["تأخیر", "تاخیر", "گزارش‌های تأخیر", "گزارش معطل"],
    workflowId: "wf-report-delay-alert",
    workflowName: "پیگیری گزارش‌های تأیید نشده",
    dashboardName: "داشبورد تأخیر گزارش",
    dashboardWidgets: [
      "گزارش‌های معطل",
      "میانگین تأخیر",
      "پزشکان دارای تأخیر",
    ],
    connectedSystems: ["PACS", "Email", "SMS", "Calendar"],
    repeatCount: 22,
  },
  {
    id: "vip",
    queries: ["vip", "بیماران vip", "بیمار vip"],
    workflowId: "wf-vip-patient",
    workflowName: "مدیریت بیماران VIP",
    dashboardName: "داشبورد VIP",
    dashboardWidgets: ["بیماران VIP", "زمان پاسخ", "اولویت‌ها"],
    connectedSystems: ["CRM", "SMS", "WhatsApp", "Calendar"],
    repeatCount: 15,
  },
];

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

export function detectDemoWorkflow(content: string): DemoWorkflowPattern | null {
  const n = normalizeQuery(content);
  for (const pattern of demoWorkflowPatterns) {
    if (
      pattern.queries.some(
        (q) => n.includes(normalizeQuery(q)) || normalizeQuery(q).includes(n)
      )
    ) {
      return pattern;
    }
  }
  return null;
}

export function buildDemoWorkflowDraft(pattern: DemoWorkflowPattern): Workflow {
  const seed =
    imagingWorkflowsSeed.find((w) => w.id === pattern.workflowId) ??
    imagingWorkflowsSeed[0]!;

  return {
    ...seed,
    id: pattern.workflowId,
    name: pattern.workflowName,
    source: "ai",
    enabled: true,
    whyAICreated: `THEMACHINE این فرآیند را از ${toPersianDigits(pattern.repeatCount)} گفتگوی مشابه در ۱۰ روز گذشته شناسایی کرد.`,
    conversationOrigin: {
      detectedAt: "امروز",
      repeatCount: pattern.repeatCount,
      repeatPeriodDays: 10,
      sampleQueries: [pattern.queries[0] ?? ""],
    },
    dashboardWidgets: pattern.dashboardWidgets.map((label, i) => ({
      id: `w${i + 1}`,
      label,
      value: "—",
    })),
  };
}

export function patternToSuggestion(
  pattern: DemoWorkflowPattern,
  draft: Workflow
): WorkflowSuggestion {
  return {
    status: "pending",
    reason: `THEMACHINE تشخیص داده است که این درخواست ${toPersianDigits(pattern.repeatCount)} بار در گفتگوهای گذشته تکرار شده و قابلیت خودکارسازی دارد.`,
    workflowId: pattern.workflowId,
    workflowName: pattern.workflowName,
    dashboardName: pattern.dashboardName,
    dashboardWidgets: pattern.dashboardWidgets,
    connectedSystems: pattern.connectedSystems,
    triggerLabel: triggerLabelFor(draft),
    actionLabels: draft.actions.map((a) => optionLabel(actionTypes, a.type)),
    repeatCount: pattern.repeatCount,
    generationPhase: undefined,
  };
}
