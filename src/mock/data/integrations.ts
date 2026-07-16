import type {
  Integration,
  IntegrationCategory,
  IntegrationRuntime,
  ConnectionStatus,
} from "@/types/integration";

export const integrationCategories: IntegrationCategory[] = [
  { id: "all", label: "تمام" },
  { id: "medical", label: "سیستم‌های پزشکی" },
  { id: "ai", label: "هوش مصنوعی" },
  { id: "patient", label: "ارتباط با بیمار" },
  { id: "business", label: "مالی و مدیریت" },
  { id: "security", label: "امنیت" },
];

export const smartSuggestions = [
  "برای ارسال خودکار گزارش MRI، اتصال پیامک را فعال کنید.",
  "دستگاه سونوگرافی ۲ ساعت است همگام نشده — بررسی اتصال توصیه می‌شود.",
  "با فعال‌سازی OCR، ثبت پرونده‌های کاغذی ۷۰٪ سریع‌تر می‌شود.",
];

export const recommendedIds = ["pacs", "whatsapp", "sepidar", "openai"];

export const integrationsMock: Integration[] = [
  // ── Medical systems ──
  {
    id: "pacs",
    name: "PACS",
    description: "آرشیو و مدیریت تصاویر DICOM",
    category: "medical",
    status: "connected",
    lastSync: "۲ دقیقه پیش",
    version: "v۴.۲.۱",
    recommended: true,
    defaultEnabled: true,
    icon: "scan",
    color: "#2d5a7b",
    signals: ["تصاویر جدید MRI/CT", "وضعیت آرشیو", "فضای ذخیره‌سازی"],
    actions: ["جستجوی DICOM", "ارسال به پزشک", "آرشیو خودکار"],
  },
  {
    id: "ris",
    name: "RIS",
    description: "سیستم اطلاعات رادیولوژی",
    category: "medical",
    status: "connected",
    lastSync: "۵ دقیقه پیش",
    version: "v۳.۱.۰",
    defaultEnabled: true,
    icon: "clipboard-list",
    color: "#4a7a96",
    signals: ["نوبت‌های امروز", "گزارش‌های معوق", "وضعیت پزشک"],
    actions: ["ثبت نوبت", "ارجاع به پزشک", "چاپ گزارش"],
  },
  {
    id: "dicom",
    name: "DICOM Server",
    description: "سرور انتقال تصاویر پزشکی",
    category: "medical",
    status: "connected",
    lastSync: "۱ دقیقه پیش",
    version: "v۲.۸.۴",
    defaultEnabled: true,
    icon: "server",
    color: "#4da8a8",
    signals: ["ترافیک شبکه", "صف انتقال", "خطاهای C-STORE"],
    actions: ["ارسال تصویر", "Query/Retrieve", "مدیریت AE Title"],
  },
  {
    id: "mri",
    name: "دستگاه MRI",
    description: "Siemens Magnetom — دستگاه ۲",
    category: "medical",
    status: "connected",
    lastSync: "۳۰ ثانیه پیش",
    version: "Syngo vD13",
    defaultEnabled: true,
    icon: "magnet",
    color: "#5b5fc7",
    signals: ["وضعیت دستگاه", "سری‌های امروز", "هشدارهای سخت‌افزار"],
    actions: ["دریافت سری", "برنامه‌ریزی اسکن", "گزارش استفاده"],
  },
  {
    id: "ct",
    name: "دستگاه CT",
    description: "GE Revolution — سی‌تی اسکن",
    category: "medical",
    status: "connected",
    lastSync: "۱ دقیقه پیش",
    version: "AW v4.7",
    defaultEnabled: true,
    icon: "layers",
    color: "#6b7fc7",
    signals: ["اسکن‌های امروز", "دوز تابش", "وضعیت لوله"],
    actions: ["دریافت سری", "پروتکل اسکن", "گزارش روزانه"],
  },
  {
    id: "ultrasound",
    name: "سونوگرافی",
    description: "دستگاه سونو — بخش زنان",
    category: "medical",
    status: "needs_attention",
    lastSync: "۲ ساعت پیش",
    version: "v۱.۹.۰",
    defaultEnabled: true,
    icon: "waves",
    color: "#c4a574",
    signals: ["آخرین همگام‌سازی", "تصاویر pending", "وضعیت شبکه"],
    actions: ["دریافت تصویر", "ثبت گزارش", "آرشیو"],
  },
  {
    id: "laboratory",
    name: "آزمایشگاه",
    description: "نتایج آزمایش و پاتولوژی",
    category: "medical",
    status: "connected",
    lastSync: "۸ دقیقه پیش",
    version: "LIS v۳.۴",
    defaultEnabled: true,
    icon: "flask-conical",
    color: "#4d8a5c",
    signals: ["نتایج جدید", "نتایج بحرانی", "نمونه‌های pending"],
    actions: ["دریافت نتیجه", "ارسال به پزشک", "چاپ برچسب"],
  },
  {
    id: "insurance",
    name: "درگاه بیمه",
    description: "استعلام و تأیید پوشش بیمه",
    category: "medical",
    status: "connected",
    lastSync: "۴ دقیقه پیش",
    version: "v۱.۶.۲",
    defaultEnabled: true,
    icon: "shield-check",
    color: "#4da8a8",
    signals: ["وضعیت پوشش", "سقف بیمه", "پیش‌نیازها"],
    actions: ["استعلام بیمه", "ثبت معرفی‌نامه", "پیگیری تأیید"],
  },

  // ── Patient communication ──
  {
    id: "whatsapp",
    name: "واتساپ",
    description: "پیام و یادآوری نوبت به بیمار",
    category: "patient",
    status: "connected",
    lastSync: "۱ دقیقه پیش",
    version: "Business API",
    recommended: true,
    defaultEnabled: true,
    icon: "message-circle",
    color: "#25D366",
    signals: ["پیام‌های ورودی", "وضعیت تحویل", "نرخ پاسخ"],
    actions: ["ارسال یادآوری", "ارسال گزارش", "پاسخ خودکار"],
  },
  {
    id: "sms",
    name: "پیامک",
    description: "OTP و اطلاع‌رسانی انبوه",
    category: "patient",
    status: "connected",
    lastSync: "۲ دقیقه پیش",
    version: "v۱.۰",
    defaultEnabled: true,
    icon: "smartphone",
    color: "#5b5fc7",
    signals: ["پیامک‌های ارسالی", "تحویل ناموفق", "اعتبار باقی‌مانده"],
    actions: ["ارسال OTP", "یادآوری نوبت", "اطلاع آماده بودن گزارش"],
  },
  {
    id: "email",
    name: "ایمیل",
    description: "ارسال گزارش PDF به بیمار",
    category: "patient",
    status: "disconnected",
    lastSync: undefined,
    version: undefined,
    defaultEnabled: false,
    icon: "mail",
    color: "#b8943a",
    signals: ["صندوق ورودی", "ایمیل‌های ارسالی", "bounce rate"],
    actions: ["ارسال گزارش PDF", "خلاصه مکاتبه", "یادآوری"],
  },

  // ── AI ──
  {
    id: "openai",
    name: "THE MACHINE AI",
    description: "تحلیل گزارش و دستیار پزشکی",
    category: "ai",
    status: "connected",
    lastSync: "۳۰ ثانیه پیش",
    version: "GPT-4o",
    recommended: true,
    defaultEnabled: true,
    icon: "sparkles",
    color: "#10a37f",
    signals: ["درخواست‌های AI", "دقت پاسخ", "مصرف token"],
    actions: ["تحلیل MRI", "گزارش‌نویسی", "پیشنهاد Workflow"],
  },
  {
    id: "ocr",
    name: "OCR Engine",
    description: "استخراج متن از فرم و نسخه",
    category: "ai",
    status: "connected",
    lastSync: "۶ دقیقه پیش",
    version: "v۲.۰",
    defaultEnabled: true,
    icon: "scan-text",
    color: "#2d5a7b",
    signals: ["اسناد پردازش‌شده", "دقت OCR", "صف انتظار"],
    actions: ["اسکن فرم", "تبدیل PDF", "استخراج فیلد"],
  },
  {
    id: "voice",
    name: "دیکته صوتی",
    description: "گزارش‌نویسی با صدای پزشک",
    category: "ai",
    status: "disconnected",
    lastSync: undefined,
    version: undefined,
    defaultEnabled: false,
    icon: "mic",
    color: "#4da8a8",
    signals: ["جلسات ضبط", "دقت تبدیل", "زبان تشخیص"],
    actions: ["شروع دیکته", "ویرایش متن", "ثبت در RIS"],
  },

  // ── Business ──
  {
    id: "sepidar",
    name: "سپیدار",
    description: "حسابداری و فاکتور مرکز",
    category: "business",
    status: "connected",
    lastSync: "۱۰ دقیقه پیش",
    version: "v۱۴.۲",
    recommended: true,
    defaultEnabled: true,
    icon: "calculator",
    color: "#2d5a7b",
    signals: ["فاکتورهای امروز", "بدهی بیماران", "گردش مالی"],
    actions: ["صدور فاکتور", "گزارش مالی", "پیگیری بدهی"],
  },
  {
    id: "crm",
    name: "CRM بیماران",
    description: "پرونده و تاریخچه بیمار",
    category: "business",
    status: "connected",
    lastSync: "۷ دقیقه پیش",
    version: "v۴.۰",
    defaultEnabled: true,
    icon: "contact",
    color: "#4da8a8",
    signals: ["بیماران جدید", "پیگیری‌های باز", "رضایت بیمار"],
    actions: ["جستجوی بیمار", "ثبت تماس", "تاریخچه مراجعات"],
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "همگام‌سازی نوبت پزشکان",
    category: "business",
    status: "connected",
    lastSync: "۳ دقیقه پیش",
    version: "API v۳",
    defaultEnabled: true,
    icon: "calendar",
    color: "#4285F4",
    signals: ["نوبت‌های امروز", "تداخل برنامه", "لغوها"],
    actions: ["ثبت نوبت", "ارسال دعوت", "یادآوری"],
  },

  // ── Security ──
  {
    id: "active-directory",
    name: "Active Directory",
    description: "مدیریت کاربران و دسترسی",
    category: "security",
    status: "connected",
    lastSync: "۵ دقیقه پیش",
    version: "AD DS 2019",
    defaultEnabled: true,
    icon: "users-round",
    color: "#0078D4",
    signals: ["ورود کاربران", "تلاش ناموفق", "گروه‌های دسترسی"],
    actions: ["مدیریت کاربر", "بازنشانی رمز", "گزارش امنیتی"],
  },
  {
    id: "backup",
    name: "Backup Server",
    description: "پشتیبان‌گیری خودکار داده",
    category: "security",
    status: "connected",
    lastSync: "۳۰ دقیقه پیش",
    version: "v۵.۰",
    defaultEnabled: true,
    icon: "database-backup",
    color: "#4d8a5c",
    signals: ["آخرین backup", "فضای ذخیره", "خطاهای backup"],
    actions: ["backup دستی", "بازیابی", "برنامه‌ریزی"],
  },
];

export function initIntegrationRuntime(): Record<string, IntegrationRuntime> {
  return Object.fromEntries(
    integrationsMock.map((item) => [
      item.id,
      {
        enabled: item.defaultEnabled,
        status: item.defaultEnabled ? item.status : "disabled",
        lastSync: item.defaultEnabled ? item.lastSync : undefined,
      },
    ])
  );
}

export function getConnectionStats(
  integrations: Integration[],
  runtime: Record<string, IntegrationRuntime>
) {
  let connected = 0;
  let syncing = 0;
  let needsAttention = 0;
  let disconnected = 0;
  let disabled = 0;
  let enabled = 0;

  for (const item of integrations) {
    const state = runtime[item.id];
    if (!state?.enabled) {
      disabled++;
      continue;
    }
    enabled++;
    switch (state.status) {
      case "connected":
        connected++;
        break;
      case "syncing":
        syncing++;
        break;
      case "needs_attention":
        needsAttention++;
        break;
      case "disconnected":
        disconnected++;
        break;
    }
  }

  return {
    total: integrations.length,
    enabled,
    disabled,
    connected,
    syncing,
    needsAttention,
    disconnected,
    updateAvailable: 0,
  };
}

export function resolveDisplayStatus(
  item: Integration,
  runtime: IntegrationRuntime
): ConnectionStatus {
  if (!runtime.enabled) return "disabled";
  return runtime.status;
}
