import type { ModuleMeta, ModuleId } from "@/types";
import { pageLabels } from "@/config/labels";

export const moduleMetaMock: Record<ModuleId, ModuleMeta> = {
  patients: {
    id: "patients",
    title: pageLabels.patients,
    subtitle: "مرکز هوش بیماران",
    aiSummary:
      "۲۴ بیمار فعال. ۳ پرونده نیاز به پیگیری فوری. AI پیشنهاد می‌کند پرونده ۲۱۴ را اولویت دهید.",
    suggestions: [
      "بیماران در انتظار تأیید",
      "MRIهای این هفته",
      "پرونده‌های با بدهی",
      "ثبت بیمار جدید",
    ],
    quickActions: [
      { label: "ثبت بیمار", href: "/patients" },
      { label: "جستجو در هوش مصنوعی", href: "/chat" },
    ],
  },
  doctors: {
    id: "doctors",
    title: pageLabels.doctors,
    subtitle: "مرکز پزشکان",
    aiSummary:
      "۴ پزشک فعال. دکتر کریمی بار کاری بحرانی دارد. پیشنهاد: توزیع مجدد بار.",
    suggestions: ["پزشکان فعال امروز", "عملکرد هفتگی", "برنامه فردا"],
    quickActions: [{ label: "فضای کار هوش مصنوعی", href: "/chat" }],
  },
  imaging: {
    id: "imaging",
    title: pageLabels.imaging,
    subtitle: "تصویربرداری پزشکی",
    aiSummary: "۱۶ MRI امروز. ۳ مورد آماده بررسی. دستگاه ۲ پرکاربردترین.",
    suggestions: ["MRIهای آماده", "CT امروز", "دستگاه ۲"],
    quickActions: [{ label: "نمایشگر تصویر", href: "/imaging" }],
  },
  appointments: {
    id: "appointments",
    title: pageLabels.appointments,
    subtitle: "نوبت‌ها",
    aiSummary: "۳۴ نوبت امروز. ۲ لغو. ۵ در حال انجام.",
    suggestions: ["نوبت‌های فردا", "لغوشده‌ها", "در حال انجام"],
    quickActions: [{ label: "ثبت نوبت" }],
  },
  reports: {
    id: "reports",
    title: pageLabels.reports,
    subtitle: "گزارش‌ها",
    aiSummary: "۷ گزارش باز. ۳ فوری. ۲ منتظر تأیید پزشک.",
    suggestions: ["گزارش‌های فوری", "گزارش ماهانه", "PDF"],
    quickActions: [{ label: "گزارش جدید" }],
  },
  analytics: {
    id: "analytics",
    title: pageLabels.analytics,
    subtitle: "هوش پزشکی",
    aiSummary:
      "درآمد ۸٪ کمتر از هفته گذشته. MRI بیشترین سهم. پیش‌بینی: رشد ۵٪ ماه آینده.",
    suggestions: ["پیش‌بینی ماه", "عملکرد دستگاه‌ها", "روند بیماران"],
    quickActions: [{ label: "تحلیل هوش مصنوعی", href: "/chat" }],
  },
  knowledge: {
    id: "knowledge",
    title: pageLabels.knowledge,
    subtitle: "پایگاه دانش",
    aiSummary: "۱۲۴ پروتکل. ۴۸ FAQ. AI از این بخش برای پاسخ‌دهی استفاده می‌کند.",
    suggestions: ["پروتکل MRI", "راهنمای پزشک", "سیاست‌ها"],
    quickActions: [{ label: "جستجو" }],
  },
  workflows: {
    id: "workflows",
    title: pageLabels.workflows,
    subtitle: "اتوماسیون مرکز تصویربرداری",
    aiSummary:
      "۱۲ گردش‌کار فعال در پردیس نور — ۱ ساخته‌شده از گفتگو. THEMACHINE از مکالمات یاد می‌گیرد و خودکار می‌سازد.",
    suggestions: ["گزارش MRI", "نوبت‌های فردا", "بیمار VIP", "گزارش بحرانی"],
    quickActions: [{ label: "ورک‌فلو", href: "/workflows" }],
  },
  automation: {
    id: "automation",
    title: pageLabels.automation,
    subtitle: "مرکز اتوماسیون",
    aiSummary:
      "۸ اتوماسیون فعال. پیشنهاد: Workflow کامل MRI → پزشک → SMS → آرشیو.",
    suggestions: ["فعال‌سازی", "پیشنهاد AI", "تست Workflow"],
    quickActions: [{ label: "اتوماسیون جدید" }],
  },
  financial: {
    id: "financial",
    title: pageLabels.financial,
    subtitle: "هوش مالی",
    aiSummary: "درآمد ماه: ۱.۲B. ۱۲٪ بدهی.pending. ۳ فاکتور معوق.",
    suggestions: ["بدهی‌ها", "بیمه", "فاکتورها"],
    quickActions: [{ label: "گزارش مالی" }],
  },
  notifications: {
    id: "notifications",
    title: pageLabels.notifications,
    subtitle: "مرکز اعلان‌ها",
    aiSummary: "۱۲ اعلان جدید. ۲ فوری. ۵ مربوط به MRI.",
    suggestions: ["فوری", "امروز", "Workflow"],
    quickActions: [{ label: "علامت‌گذاری همه" }],
  },
  integrations: {
    id: "integrations",
    title: pageLabels.integrations,
    subtitle: "اتصال به هر سیستم سازمان",
    aiSummary:
      "۱۹ اتصال تخصصی. PACS، واتساپ و سپیدار فعال. سونوگرافی نیاز به توجه.",
    suggestions: ["وضعیت PACS", "اتصال پیامک", "Google Calendar", "Azure AI"],
    quickActions: [{ label: "اتصال جدید", href: "/integrations" }],
  },
  users: {
    id: "users",
    title: pageLabels.users,
    subtitle: "مدیریت کاربران",
    aiSummary: "۱۲ کاربر فعال. ۲ دعوت‌نامه در انتظار. ۱ حساب غیرفعال.",
    suggestions: ["کاربران فعال", "دعوت‌نامه‌ها", "آخرین ورود"],
    quickActions: [{ label: "دعوت کاربر", href: "/users" }],
  },
  roles: {
    id: "roles",
    title: pageLabels.roles,
    subtitle: "نقش‌ها و سطح دسترسی",
    aiSummary: "۶ نقش تعریف‌شده. ۲ نقش سفارشی. سیاست RBAC فعال.",
    suggestions: ["نقش مدیر", "دسترسی پزشک", "لاگ تغییرات"],
    quickActions: [{ label: "نقش جدید", href: "/roles" }],
  },
  settings: {
    id: "settings",
    title: pageLabels.settings,
    subtitle: "تنظیمات",
    aiSummary: "سیستم به‌روز. ۳ کاربر فعال. Dark mode خاموش.",
    suggestions: ["ظاهر", "ترجیحات هوش مصنوعی", "امنیت"],
    quickActions: [{ label: "پروفایل", href: "/settings" }],
  },
};

export function getModuleMeta(id: ModuleId): ModuleMeta {
  return moduleMetaMock[id];
}
