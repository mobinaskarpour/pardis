import type {
  Workflow,
  WorkflowDashboardWidget,
  WidgetAnalyticsSection,
  WidgetVizType,
} from "@/types/workflow";
import { workflowStatus } from "@/types/workflow";

export interface DashboardWidgetInstance extends WorkflowDashboardWidget {
  workflowId: string;
  workflowName: string;
  workflowCategory: Workflow["category"];
}

export interface WorkflowDashboardGroup {
  workflowId: string;
  workflowName: string;
  category: Workflow["category"];
  status: ReturnType<typeof workflowStatus>;
  source: Workflow["source"];
  lastRun: string;
  widgets: DashboardWidgetInstance[];
}

function w(
  id: string,
  label: string,
  value: string,
  vizType: WidgetVizType,
  analyticsSection: WidgetAnalyticsSection,
  extra?: Partial<WorkflowDashboardWidget>
): WorkflowDashboardWidget {
  return { id, label, value, vizType, analyticsSection, ...extra };
}

/** Full widget templates per workflow — auto-generated on activation */
const WORKFLOW_WIDGET_TEMPLATES: Record<string, WorkflowDashboardWidget[]> = {
  "wf-mri-report-prep": [
    w("reports-today", "گزارش‌های امروز", "۲۴", "live-counter", "widgets", {
      numericValue: 24,
      trend: "+۳",
      sparkline: [18, 20, 19, 22, 24, 23, 24],
    }),
    w("pending", "گزارش‌های معوق", "۲", "execution-pulse", "execution", {
      numericValue: 2,
      trend: "-۱",
    }),
    w("avg-time", "میانگین زمان گزارش", "۳۸ دقیقه", "tiny-trend", "performance", {
      sparkline: [52, 48, 44, 42, 40, 38, 38],
      trend: "-۱۲٪",
    }),
    w("doctor-perf", "عملکرد رادیولوژیست", "۹۴٪", "relationship", "performance", {
      healthScore: 94,
      related: [
        { label: "دکتر کریمی", value: 96 },
        { label: "دکتر موسوی", value: 92 },
        { label: "دکتر رضایی", value: 91 },
      ],
    }),
    w("critical", "یافته‌های بحرانی", "۰", "execution-pulse", "execution", {
      numericValue: 0,
    }),
    w("weekly", "روند هفتگی", "↑ ۸٪", "tiny-trend", "widgets", {
      sparkline: [16, 18, 17, 20, 22, 21, 24],
      trend: "+۸٪",
    }),
  ],

  "wf-tomorrow-appointments": [
    w("today-appt", "نوبت‌های فردا", "۴۷", "live-counter", "widgets", {
      numericValue: 47,
      sparkline: [38, 42, 40, 45, 47],
    }),
    w("noshow", "نرخ غیبت", "۷٪", "circular-health", "performance", {
      healthScore: 93,
      trend: "-۲٪",
    }),
    w("cancel", "لغوشده‌ها", "۳", "mini-timeline", "execution", {
      timeline: [
        { time: "۲۲:۰۰", label: "لغو بیمار ۱۹۸" },
        { time: "۲۲:۰۵", label: "جایگزین بیمار ۲۱۰" },
        { time: "۲۲:۱۲", label: "لغو بیمار ۱۸۵" },
      ],
    }),
    w("capacity", "ظرفیت", "۸۲٪", "progress-wave", "widgets", {
      healthScore: 82,
    }),
    w("wait", "زمان انتظار", "۱۸ دقیقه", "tiny-trend", "performance", {
      sparkline: [22, 20, 19, 18, 17, 18, 18],
      trend: "-۳ دقیقه",
    }),
  ],

  "wf-insurance-check": [
    w("pending-claims", "در انتظار", "۳", "execution-pulse", "execution", {
      numericValue: 3,
    }),
    w("approved", "تأییدشده", "۲۸", "live-counter", "widgets", {
      numericValue: 28,
      trend: "+۴",
    }),
    w("rejected", "ردشده", "۲", "heatmap", "execution", {
      heatmap: [0.1, 0.2, 0.15, 0.3, 0.2, 0.1, 0.05],
    }),
    w("claim-value", "ارزش مطالبات", "۱۲.۴M", "tiny-trend", "performance", {
      sparkline: [10, 11, 10.5, 12, 11.8, 12.2, 12.4],
    }),
    w("proc-time", "زمان پردازش", "۴۵ ثانیه", "progress-wave", "performance", {
      healthScore: 88,
      trend: "-۱۲ ثانیه",
    }),
  ],

  "wf-auto-results": [
    w("sms", "SMS ارسال‌شده", "۱۸", "live-counter", "widgets", {
      numericValue: 18,
      sparkline: [12, 14, 15, 16, 18],
    }),
    w("whatsapp", "WhatsApp", "۱۵", "live-counter", "widgets", {
      numericValue: 15,
    }),
    w("email", "Email", "۹", "live-counter", "widgets", { numericValue: 9 }),
    w("read-rate", "نرخ باز شدن", "۷۸٪", "circular-health", "performance", {
      healthScore: 78,
      trend: "+۵٪",
    }),
    w("failed", "ناموفق", "۱", "execution-pulse", "execution", {
      numericValue: 1,
    }),
  ],

  "wf-report-delay-alert": [
    w("delayed", "گزارش معوق", "۳", "execution-pulse", "execution", {
      numericValue: 3,
      trend: "+۱",
    }),
    w("avg-delay", "میانگین تأخیر", "۱.۴ ساعت", "tiny-trend", "performance", {
      sparkline: [2.8, 2.2, 1.8, 1.6, 1.4, 1.4, 1.4],
      trend: "-۴۵٪",
    }),
    w("escalations", "تشدید امروز", "۲", "mini-timeline", "execution", {
      timeline: [
        { time: "۰۹:۳۰", label: "سطح ۱ — دکتر کریمی" },
        { time: "۱۱:۰۰", label: "سطح ۲ — مدیر بخش" },
      ],
    }),
    w("doctor-delay", "پزشک تأخیردار", "۱", "relationship", "performance", {
      related: [{ label: "دکتر موسوی", value: 3 }],
    }),
    w("health", "سلامت گردش‌کار", "هشدار", "circular-health", "widgets", {
      healthScore: 62,
    }),
  ],

  "wf-device-health": [
    w("mri-health", "سلامت MRI", "۹۲٪", "circular-health", "widgets", {
      healthScore: 92,
      related: [
        { label: "MRI-1", value: 98 },
        { label: "MRI-2", value: 85 },
        { label: "MRI-3", value: 96 },
      ],
    }),
    w("ct-health", "سلامت CT", "۹۶٪", "circular-health", "widgets", {
      healthScore: 96,
    }),
    w("qc-status", "وضعیت QC", "۸/۹", "progress-wave", "execution", {
      healthScore: 89,
    }),
    w("maintenance", "تیکت تعمیر", "۲", "mini-timeline", "execution", {
      timeline: [
        { time: "۰۷:۱۲", label: "MRI-2 coil calibration" },
        { time: "۰۷:۴۵", label: "مهندس اختصاص یافت" },
      ],
    }),
    w("errors", "خطاها", "۱", "execution-pulse", "execution", {
      numericValue: 1,
    }),
  ],

  "wf-patient-admission": [
    w("admissions", "پذیرش امروز", "۳۴", "live-counter", "widgets", {
      numericValue: 34,
      sparkline: [8, 14, 20, 26, 30, 34],
    }),
    w("avg-admit", "میانگین زمان", "۹۰ ثانیه", "progress-wave", "performance", {
      healthScore: 91,
    }),
    w("queue", "صف فعلی", "۴", "execution-pulse", "execution", {
      numericValue: 4,
    }),
    w("insurance-ok", "بیمه تأیید", "۹۱٪", "circular-health", "performance", {
      healthScore: 91,
    }),
    w("activity", "فعالیت ساعتی", "—", "heatmap", "widgets", {
      heatmap: [0.2, 0.5, 0.8, 0.9, 0.7, 0.6, 0.4, 0.3],
    }),
  ],

  "wf-daily-analytics": [
    w("revenue", "درآمد امروز", "۴۸.۲M", "tiny-trend", "performance", {
      sparkline: [42, 44, 45, 46, 47, 48, 48.2],
      trend: "+۵٪",
    }),
    w("reports", "گزارش‌ها", "۲۸", "live-counter", "widgets", {
      numericValue: 28,
    }),
    w("wait-time", "زمان انتظار", "۱۸ دقیقه", "tiny-trend", "performance", {
      sparkline: [24, 22, 20, 19, 18, 18, 18],
    }),
    w("rejected", "گزارش رد", "۱", "execution-pulse", "execution", {
      numericValue: 1,
    }),
    w("ai-summary", "خلاصه AI", "آماده", "mini-timeline", "optimizations", {
      timeline: [{ time: "۲۳:۰۵", label: "خلاصه اجرایی تولید شد" }],
    }),
  ],

  "wf-vip-patient": [
    w("vip-today", "VIP امروز", "۲", "live-counter", "widgets", {
      numericValue: 2,
    }),
    w("room", "اتاق اختصاصی", "رزرو", "execution-pulse", "execution", {
      numericValue: 1,
    }),
    w("priority", "اولویت گزارش", "فعال", "progress-wave", "performance", {
      healthScore: 100,
    }),
    w("satisfaction", "رضایت", "۱۰۰٪", "circular-health", "performance", {
      healthScore: 100,
    }),
  ],

  "wf-emergency-patient": [
    w("emergency", "اورژانس امروز", "۱", "execution-pulse", "execution", {
      numericValue: 1,
    }),
    w("sla", "SLA گزارش", "۹۷٪", "circular-health", "performance", {
      healthScore: 97,
    }),
    w("scan-time", "زمان اسکن", "۵ دقیقه", "progress-wave", "performance", {
      healthScore: 95,
    }),
    w("report-time", "زمان گزارش", "۲۲ دقیقه", "tiny-trend", "performance", {
      sparkline: [35, 30, 28, 25, 22],
      trend: "-۳۷٪",
    }),
  ],

  "wf-critical-report": [
    w("critical-today", "بحرانی امروز", "۰", "execution-pulse", "execution", {
      numericValue: 0,
    }),
    w("notify-time", "زمان اطلاع", "<۳ دقیقه", "progress-wave", "performance", {
      healthScore: 100,
    }),
    w("confirm-rate", "نرخ تأیید", "۱۰۰٪", "circular-health", "performance", {
      healthScore: 100,
    }),
    w("channels", "کانال‌ها", "۳/۳", "relationship", "widgets", {
      related: [
        { label: "تماس", value: 100 },
        { label: "SMS", value: 98 },
        { label: "WhatsApp", value: 96 },
      ],
    }),
  ],

  "wf-ai-detected": [
    w("ready-reports", "گزارش‌های آماده", "۱۲", "live-counter", "widgets", {
      numericValue: 12,
      trend: "+۲",
    }),
    w("waiting", "بیماران منتظر", "۵", "execution-pulse", "execution", {
      numericValue: 5,
    }),
    w("revenue-today", "درآمد امروز", "۴۸.۲M", "tiny-trend", "performance", {
      sparkline: [40, 42, 44, 46, 48, 48.2],
    }),
    w("delayed-doc", "پزشک تأخیردار", "۱", "relationship", "performance", {
      related: [{ label: "دکتر موسوی", value: 3 }],
    }),
    w("wf-health", "سلامت گردش‌کار", "۹۸٪", "circular-health", "widgets", {
      healthScore: 98,
    }),
  ],
};

export function getWorkflowWidgets(workflow: Workflow): WorkflowDashboardWidget[] {
  const template = WORKFLOW_WIDGET_TEMPLATES[workflow.id];
  if (template) return template;
  return workflow.dashboardWidgets.map((widget, i) => ({
    ...widget,
    vizType: widget.vizType ?? inferVizType(widget.label, i),
    analyticsSection: widget.analyticsSection ?? "widgets",
    numericValue: widget.numericValue ?? parseNumeric(widget.value),
    sparkline: widget.sparkline ?? defaultSparkline(i),
  }));
}

function inferVizType(label: string, index: number): WidgetVizType {
  if (/سلامت|نرخ|رضایت|SLA|ظرفیت/.test(label)) return "circular-health";
  if (/روند|میانگین|درآمد|زمان/.test(label)) return "tiny-trend";
  if (/تأخیر|معوق|خطا|بحرانی|اورژانس/.test(label)) return "execution-pulse";
  if (/عملکرد|پزشک|رادیولوژ/.test(label)) return "relationship";
  const types: WidgetVizType[] = [
    "live-counter",
    "tiny-trend",
    "circular-health",
    "progress-wave",
    "execution-pulse",
  ];
  return types[index % types.length];
}

function parseNumeric(value: string): number | undefined {
  const n = parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function defaultSparkline(seed: number): number[] {
  const base = 10 + seed * 3;
  return Array.from({ length: 7 }, (_, i) => base + Math.sin(i + seed) * 3 + i);
}

export function buildDashboardGroups(workflows: Workflow[]): WorkflowDashboardGroup[] {
  return workflows
    .filter((w) => w.enabled && workflowStatus(w) !== "paused")
    .map((workflow) => ({
      workflowId: workflow.id,
      workflowName: workflow.name,
      category: workflow.category,
      status: workflowStatus(workflow),
      source: workflow.source,
      lastRun: workflow.lastRun,
      widgets: getWorkflowWidgets(workflow).map((widget) => ({
        ...widget,
        workflowId: workflow.id,
        workflowName: workflow.name,
        workflowCategory: workflow.category,
      })),
    }));
}

export function flattenDashboardWidgets(
  groups: WorkflowDashboardGroup[]
): DashboardWidgetInstance[] {
  return groups.flatMap((g) => g.widgets);
}

export function widgetDetailHref(
  workflowId: string,
  widget: WorkflowDashboardWidget
): string {
  return `/analytics/${encodeURIComponent(`${workflowId}__${widget.id}`)}`;
}

/** Simulate live tick — nudge counters slightly */
export function tickWidgetValue(widget: DashboardWidgetInstance): DashboardWidgetInstance {
  if (widget.vizType !== "live-counter" || widget.numericValue == null) return widget;
  const delta = Math.random() > 0.7 ? 1 : 0;
  const next = widget.numericValue + delta;
  return {
    ...widget,
    numericValue: next,
    value: String(next),
  };
}
