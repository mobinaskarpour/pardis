import type { ResponseFormat } from "@/types/ai";

export interface ContextualAction {
  id: string;
  emoji: string;
  label: string;
  query: string;
  accent?: string;
}

export interface QuickCommand {
  id: string;
  command: string;
  label: string;
  query: string;
}

export interface TodayKpi {
  label: string;
  value: string;
  trend?: string;
}

export interface ContextTask {
  id: string;
  label: string;
  urgent?: boolean;
}

export const chatGreeting = {
  timeLabel: "صبح بخیر",
  userName: "دکتر اخلاق‌پور",
  headline: "امروز دوست دارید چه کاری را به THEMACHINE بسپارید؟",
  placeholder:
    "هر سوالی درباره مرکز، بیماران، گزارش‌ها، مالی، دستگاه‌ها یا فرآیندها دارید بپرسید...",
};

export const contextualSuggestedActions: ContextualAction[] = [
  {
    id: "mri-ready",
    emoji: "🩻",
    label: "گزارش‌های MRI امروز",
    query: "گزارش‌های MRI آماده امروز را نشان بده",
    accent: "from-accent-cyan/8 to-transparent border-accent-cyan/20",
  },
  {
    id: "appointments",
    emoji: "📅",
    label: "نوبت‌های امروز",
    query: "وضعیت نوبت‌های امروز",
    accent: "from-primary/8 to-transparent border-primary/20",
  },
  {
    id: "insurance",
    emoji: "💳",
    label: "وضعیت بیمه",
    query: "وضعیت بیمه بیماران امروز",
    accent: "from-success/8 to-transparent border-success/20",
  },
  {
    id: "auto-results",
    emoji: "📩",
    label: "ارسال نتایج",
    query: "ارسال نتایج به بیماران",
    accent: "from-accent-indigo/8 to-transparent border-accent-indigo/20",
  },
  {
    id: "devices",
    emoji: "🔧",
    label: "وضعیت دستگاه‌ها",
    query: "وضعیت دستگاه‌های تصویربرداری",
    accent: "from-accent-warm/10 to-transparent border-accent-warm/25",
  },
  {
    id: "delayed-reports",
    emoji: "⚠",
    label: "گزارش‌های تأخیر خورده",
    query: "گزارش‌های تأخیر خورده را نشان بده",
    accent: "from-warning/10 to-transparent border-warning/25",
  },
  {
    id: "vip",
    emoji: "🏥",
    label: "بیماران VIP",
    query: "بیماران VIP امروز",
    accent: "from-accent-indigo/8 to-transparent border-accent-indigo/20",
  },
];

export const quickCommands: QuickCommand[] = [
  { id: "workflow", command: "ورک‌فلو", label: "ورک‌فلو", query: "ساخت ورک‌فلو جدید" },
  { id: "dashboard", command: "داشبورد", label: "داشبورد", query: "داشبورد عملیاتی امروز" },
  { id: "report", command: "گزارش", label: "گزارش", query: "گزارش‌های باز امروز" },
  { id: "patient", command: "بیمار", label: "بیمار", query: "پرونده بیمار احمدی را باز کن" },
  { id: "device", command: "دستگاه", label: "دستگاه", query: "وضعیت دستگاه‌های تصویربرداری" },
  { id: "appointment", command: "نوبت", label: "نوبت", query: "نوبت‌های امروز" },
  { id: "insurance", command: "بیمه", label: "بیمه", query: "وضعیت بیمه بیماران امروز" },
  { id: "search", command: "جستجو", label: "جستجو", query: "جستجو در پرونده‌ها و گزارش‌ها" },
];

export const todayKpis: TodayKpi[] = [
  { label: "بیماران امروز", value: "۴۷", trend: "+۳" },
  { label: "گزارش آماده", value: "۲۴", trend: "+۵" },
  { label: "درآمد", value: "۴۸٫۲ میلیون", trend: "+۵٪" },
  { label: "دستگاه فعال", value: "۵/۶" },
];

export const recentWorkflowsContext = [
  { id: "wf-mri-report-prep", name: "آماده‌سازی گزارش MRI", status: "فعال" },
  { id: "wf-insurance-check", name: "بررسی وضعیت بیمه", status: "فعال" },
  { id: "wf-report-delay-alert", name: "هشدار تأخیر گزارش", status: "هشدار" },
];

export const pinnedConversationsContext = [
  { id: "conv-1", title: "پرونده احمدی" },
  { id: "conv-dose", title: "گزارش دوز CT" },
];

export const suggestedAutomations = [
  "ارسال خودکار نتایج MRI",
  "یادآوری نوبت فردا",
  "QC شبانه دستگاه‌ها",
];

export const upcomingTasks: ContextTask[] = [
  { id: "t1", label: "تأیید ۳ گزارش MRI", urgent: true },
  { id: "t2", label: "بررسی QC دستگاه ۲" },
  { id: "t3", label: "پردازش ۵ مطالبه بیمه" },
];

export const pendingApprovals = [
  { id: "a1", label: "گزارش MRI — بیمار ۲۱۴" },
  { id: "a2", label: "لغو نوبت — بیمار ۱۹۸" },
];

export const recommendedWorkflows = [
  { id: "wf-auto-results", name: "ارسال خودکار نتایج" },
  { id: "wf-device-health", name: "پایش سلامت دستگاه" },
];

const BASE_THINKING = [
  "در حال جستجو...",
  "در حال بررسی PACS...",
  "در حال تحلیل گزارش‌ها...",
  "در حال ساخت پاسخ...",
];

export function getThinkingSteps(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes("بیمار") || q.includes("پرونده"))
    return ["در حال جستجو...", "در حال بارگذاری پرونده...", "در حال تحلیل سوابق...", "در حال ساخت پاسخ..."];
  if (q.includes("mri") || q.includes("pacs") || q.includes("تصویر"))
    return ["در حال جستجو...", "در حال بررسی PACS...", "در حال تحلیل تصاویر...", "در حال ساخت پاسخ..."];
  if (q.includes("درآمد") || q.includes("مالی") || q.includes("بیمه"))
    return ["در حال جستجو...", "در حال بررسی سیستم مالی...", "در حال محاسبه...", "در حال ساخت پاسخ..."];
  if (q.includes("workflow") || q.includes("گردش"))
    return ["در حال جستجو...", "در حال تحلیل الگوها...", "در حال طراحی Workflow...", "در حال ساخت پاسخ..."];
  if (q.includes("دستگاه"))
    return ["در حال جستجو...", "در حال اتصال به IoT...", "در حال بررسی وضعیت...", "در حال ساخت پاسخ..."];
  return BASE_THINKING;
}

export function getMemoryContext(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.includes("mri") || q.includes("گزارش"))
    return "بر اساس گزارش‌های امروز...";
  if (q.includes("هفته") || q.includes("عملکرد"))
    return "بر اساس گفتگوهای هفته گذشته...";
  if (q.includes("بیمار") || q.includes("احمدی"))
    return "بر اساس پرونده‌های اخیر...";
  if (q.includes("درآمد") || q.includes("مالی"))
    return "بر اساس داده‌های مالی امروز...";
  return undefined;
}

export function inferResponseFormat(canvas?: string): ResponseFormat {
  switch (canvas) {
    case "patient":
      return "medical-report";
    case "revenue":
      return "chart";
    case "patients-today":
      return "task-list";
    case "mri-ready":
      return "dashboard";
    case "workflow":
      return "workflow";
    case "report":
      return "document";
    default:
      return "answer";
  }
}

export const dashboardWidgetNames = [
  "گزارش‌های امروز",
  "نرخ موفقیت",
  "زمان پردازش",
  "هشدارها",
];

export const historyTimeGroupLabels: Record<string, string> = {
  today: "امروز",
  yesterday: "دیروز",
  week: "این هفته",
  earlier: "قبل‌تر",
};

export function inferTimeGroup(updatedAt: string): "today" | "yesterday" | "week" | "earlier" {
  if (updatedAt === "امروز" || updatedAt === "اکنون") return "today";
  if (updatedAt === "دیروز") return "yesterday";
  if (updatedAt.includes("هفته")) return "week";
  return "earlier";
}
