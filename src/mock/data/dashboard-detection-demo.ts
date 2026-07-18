import type { DashboardSuggestion } from "@/types/ai";
import type {
  DiscoveredDashboard,
  DiscoveredDashboardWidget,
} from "@/types/dashboard";
import { toPersianDigits } from "@/lib/persian";

export interface DemoDashboardPattern {
  id: string;
  queries: string[];
  scenarioName: string;
  dashboardName: string;
  description: string;
  widgets: DiscoveredDashboardWidget[];
}

export const demoDashboardPatterns: DemoDashboardPattern[] = [
  {
    id: "insurance-tracking",
    queries: [
      "وضعیت بیمه",
      "بیمه بیمار",
      "مطالبات بیمه",
      "پیگیری بیمه",
      "بررسی و پیگیری بیمه",
      "پرونده بیمه",
      "داشبورد بیمه",
      "آمار بیمه",
      "روند بیمه",
    ],
    scenarioName: "بررسی و پیگیری بیمه",
    dashboardName: "داشبورد بیمه",
    description:
      "پایش پرونده‌های بیمه، موارد معطل، زمان پاسخ و هشدارهای روزانه از گفتگوهای تکراری.",
    widgets: [
      {
        id: "ins-cases",
        label: "پرونده‌های بیمه",
        value: "۴۸",
        delta: "+۶ امروز",
        tone: "info",
        description: "پرونده‌های فعال در صف بررسی",
        sparkline: [28, 32, 30, 36, 40, 44, 48],
      },
      {
        id: "ins-pending",
        label: "پرونده‌های معطل",
        value: "۱۲",
        delta: "۳ بحرانی",
        tone: "warning",
        description: "بیش از ۴۸ ساعت بدون پاسخ",
        sparkline: [18, 16, 15, 14, 13, 12, 12],
      },
      {
        id: "ins-response",
        label: "زمان پاسخ بیمه",
        value: "۳٫۴ س",
        delta: "−۱۲٪",
        tone: "success",
        description: "میانگین زمان پاسخ شرکت‌های بیمه",
        sparkline: [5.1, 4.8, 4.2, 3.9, 3.7, 3.5, 3.4],
      },
      {
        id: "ins-weekly",
        label: "روند هفتگی",
        value: "۸۲٪",
        delta: "+۵٪",
        tone: "success",
        description: "نرخ تأیید مطالبات در ۷ روز گذشته",
        sparkline: [70, 72, 74, 76, 78, 80, 82],
      },
      {
        id: "ins-alerts",
        label: "هشدارها",
        value: "۵",
        delta: "۲ جدید",
        tone: "danger",
        description: "رد شده‌ها و تأخیرهای نیازمند اقدام",
        sparkline: [2, 3, 4, 3, 5, 4, 5],
      },
    ],
  },
  {
    id: "mri-prep",
    queries: [
      "گزارش‌های mri",
      "mri آماده",
      "گزارش mri",
      "آماده‌سازی و تأیید mri",
      "تأیید گزارش mri",
      "mri امروز",
      "داشبورد mri",
      "آمار mri",
      "گزارش‌دهی mri",
    ],
    scenarioName: "آماده‌سازی و تأیید MRI",
    dashboardName: "داشبورد MRI امروز",
    description:
      "نظارت بر MRIهای امروز، گزارش‌های آماده و تأییدنشده، سلامت دستگاه و زمان تأیید.",
    widgets: [
      {
        id: "mri-today",
        label: "MRIهای امروز",
        value: "۳۴",
        delta: "+۴",
        tone: "info",
        description: "اسکن‌های انجام‌شده از صبح",
        sparkline: [18, 22, 25, 28, 30, 32, 34],
      },
      {
        id: "mri-ready",
        label: "گزارش‌های آماده",
        value: "۲۱",
        delta: "۶۲٪",
        tone: "success",
        description: "آماده ارسال به پزشک ارجاع‌دهنده",
        sparkline: [10, 12, 14, 16, 18, 20, 21],
      },
      {
        id: "mri-unapproved",
        label: "گزارش‌های تأیید نشده",
        value: "۸",
        delta: "۲ فوری",
        tone: "warning",
        description: "در انتظار تأیید رادیولوژیست",
        sparkline: [12, 11, 10, 9, 9, 8, 8],
      },
      {
        id: "mri-health",
        label: "سلامت دستگاه",
        value: "۹۶٪",
        delta: "پایدار",
        tone: "success",
        description: "وضعیت QC و آماده‌به‌کار MRI",
        sparkline: [94, 95, 94, 96, 95, 97, 96],
      },
      {
        id: "mri-avg",
        label: "زمان متوسط تأیید",
        value: "۴۲ د",
        delta: "−۸ د",
        tone: "success",
        description: "از آماده‌شدن تا تأیید نهایی",
        sparkline: [58, 54, 50, 48, 45, 43, 42],
      },
    ],
  },
  {
    id: "appointments-tomorrow",
    queries: [
      "نوبت‌های فردا",
      "مدیریت نوبت‌های فردا",
      "نوبت فردا",
      "ظرفیت فردا",
      "نوبت‌های امروز",
      "وضعیت نوبت",
      "نوبت امروز",
      "داشبورد نوبت",
      "آمار نوبت",
    ],
    scenarioName: "مدیریت نوبت‌های فردا",
    dashboardName: "داشبورد نوبت‌دهی",
    description:
      "برنامه فردا: ظرفیت باقی‌مانده، پزشکان، دستگاه‌ها و بیماران لغوشده در یک نگاه.",
    widgets: [
      {
        id: "apt-tomorrow",
        label: "نوبت‌های فردا",
        value: "۶۷",
        delta: "+۹",
        tone: "info",
        description: "نوبت‌های رزروشده برای فردا",
        sparkline: [52, 55, 58, 60, 63, 65, 67],
      },
      {
        id: "apt-capacity",
        label: "ظرفیت باقی‌مانده",
        value: "۱۴",
        delta: "۱۸٪ آزاد",
        tone: "warning",
        description: "اسلات‌های خالی قابل رزرو",
        sparkline: [22, 20, 18, 17, 16, 15, 14],
      },
      {
        id: "apt-doctors",
        label: "پزشکان",
        value: "۹",
        delta: "فعال",
        tone: "success",
        description: "پزشکان دارای نوبت فردا",
        sparkline: [7, 8, 8, 9, 9, 9, 9],
      },
      {
        id: "apt-devices",
        label: "دستگاه‌ها",
        value: "۵/۶",
        delta: "۱ تعمیر",
        tone: "default",
        description: "دستگاه‌های در دسترس برای فردا",
        sparkline: [6, 6, 5, 5, 5, 5, 5],
      },
      {
        id: "apt-cancelled",
        label: "بیماران لغوشده",
        value: "۷",
        delta: "۳ قابل پرشدن",
        tone: "danger",
        description: "لغوهای ۲۴ ساعت اخیر",
        sparkline: [4, 5, 5, 6, 6, 7, 7],
      },
    ],
  },
  {
    id: "ops-reporting",
    queries: [
      "داشبورد عملیاتی",
      "آمار امروز",
      "گزارش‌دهی روزانه",
      "روند هفتگی مرکز",
      "تحلیل عملکرد",
    ],
    scenarioName: "گزارش‌دهی عملیاتی مرکز",
    dashboardName: "داشبورد عملیاتی",
    description:
      "خلاصه KPIهای روزانه مرکز از گفتگوهای تحلیلی و گزارش‌دهی.",
    widgets: [
      {
        id: "ops-patients",
        label: "بیماران امروز",
        value: "۴۷",
        delta: "+۳",
        tone: "info",
        sparkline: [38, 40, 42, 43, 45, 46, 47],
      },
      {
        id: "ops-revenue",
        label: "درآمد امروز",
        value: "۴۸٫۲ م",
        delta: "+۵٪",
        tone: "success",
        sparkline: [40, 42, 41, 44, 45, 47, 48],
      },
      {
        id: "ops-reports",
        label: "گزارش آماده",
        value: "۲۴",
        delta: "+۵",
        tone: "success",
        sparkline: [14, 16, 18, 19, 21, 22, 24],
      },
      {
        id: "ops-devices",
        label: "دستگاه فعال",
        value: "۵/۶",
        tone: "warning",
        sparkline: [6, 6, 5, 5, 5, 5, 5],
      },
      {
        id: "ops-alerts",
        label: "هشدارها",
        value: "۳",
        delta: "۱ جدید",
        tone: "danger",
        sparkline: [1, 2, 2, 3, 2, 3, 3],
      },
    ],
  },
];

function normalizeQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .replace(/ی/g, "ي")
    .replace(/ک/g, "ك")
    .replace(/\s+/g, " ");
}

export function detectDemoDashboard(
  content: string
): DemoDashboardPattern | null {
  const n = normalizeQuery(content);
  for (const pattern of demoDashboardPatterns) {
    if (
      pattern.queries.some((q) => {
        const nq = normalizeQuery(q);
        return n.includes(nq) || nq.includes(n);
      })
    ) {
      return pattern;
    }
  }
  return null;
}

export function buildDiscoveredDashboard(
  pattern: DemoDashboardPattern
): DiscoveredDashboard {
  return {
    id: `dash-${pattern.id}`,
    name: pattern.dashboardName,
    scenarioId: pattern.id,
    scenarioName: pattern.scenarioName,
    description: pattern.description,
    widgets: pattern.widgets.map((w) => ({ ...w })),
    source: "ai",
    createdAt: "اکنون",
    conversationOrigin: {
      detectedAt: "امروز",
      sampleQuery: pattern.queries[0] ?? pattern.scenarioName,
    },
  };
}

export function patternToDashboardSuggestion(
  pattern: DemoDashboardPattern
): DashboardSuggestion {
  return {
    status: "pending",
    reason: `این گفتگو با سناریوی «${pattern.scenarioName}» هم‌خوان است و می‌تواند به داشبورد دائمی تبدیل شود.`,
    dashboardId: `dash-${pattern.id}`,
    dashboardName: pattern.dashboardName,
    scenarioName: pattern.scenarioName,
    widgets: pattern.widgets.map((w) => ({ ...w })),
    widgetCount: pattern.widgets.length,
    generationPhase: undefined,
  };
}

export function dashboardSuggestionSummary(pattern: DemoDashboardPattern): string {
  return `داشبورد هوشمند برای «${pattern.scenarioName}» شناسایی شد — ${toPersianDigits(pattern.widgets.length)} ویجت آماده ساخت.`;
}
