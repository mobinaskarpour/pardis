import type {
  Workflow,
  WorkflowAction,
  WorkflowApproval,
  WorkflowCategoryId,
  WorkflowCondition,
  WorkflowConversationOrigin,
  WorkflowDashboardWidget,
  WorkflowOptimization,
  WorkflowPerformance,
  WorkflowRun,
  WorkflowTrigger,
} from "@/types/workflow";

interface ScenarioInput {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategoryId;
  executiveSummary: string;
  enabled?: boolean;
  health?: Workflow["health"];
  source?: Workflow["source"];
  createdFrom?: string;
  whyAICreated?: string;
  conversationOrigin?: WorkflowConversationOrigin;
  automationScore: number;
  connectedSystems: string[];
  approvals: WorkflowApproval[];
  performance: WorkflowPerformance;
  dashboardWidgets: WorkflowDashboardWidget[];
  aiOptimizations: WorkflowOptimization[];
  previewSteps: string[];
  trigger: WorkflowTrigger;
  conditions?: WorkflowCondition[];
  actions: WorkflowAction[];
  lastRun: string;
  runsToday: number;
  successRate: number;
  issue?: string;
  runs: WorkflowRun[];
}

function scenario(input: ScenarioInput): Workflow {
  return {
    enabled: true,
    health: "ok",
    source: "manual",
    conditions: [],
    ...input,
  };
}

/** 12 medical imaging center workflows for پردیس نور demo */
export const imagingWorkflowsSeed: Workflow[] = [
  scenario({
    id: "wf-mri-report-prep",
    name: "آماده‌سازی و تأیید گزارش MRI",
    description:
      "دریافت تصاویر از PACS، اطلاع به رادیولوژیست، کنترل کیفیت AI، نگارش، تأیید، PDF و ارسال به بیمار.",
    category: "imaging",
    executiveSummary:
      "این گردش‌کار مسیر کامل گزارش MRI را از ورود DICOM تا تحویل نتیجه به بیمار پوشش می‌دهد. میانگین زمان گزارش‌دهی ۴۲ دقیقه کاهش یافته و ۹۸٪ گزارش‌ها بدون تأخیر دستی تحویل می‌شوند.",
    automationScore: 94,
    connectedSystems: ["PACS", "DICOM", "Email", "SMS", "WhatsApp"],
    approvals: [
      { role: "رادیولوژیست", required: true },
      { role: "مدیر پزشکی", required: true },
    ],
    performance: {
      avgDuration: "۳۸ دقیقه",
      timeSaved: "۲.۵ ساعت/روز",
      estimatedROI: "۴۲M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "گزارش‌های امروز", value: "۲۴", trend: "+۳" },
      { id: "w2", label: "میانگین زمان گزارش", value: "۳۸ دقیقه", trend: "-۱۲٪" },
      { id: "w3", label: "گزارش‌های تأخیردار", value: "۲", trend: "-۱" },
      { id: "w4", label: "رضایت بیمار", value: "۹۶٪" },
      { id: "w5", label: "سلامت گردش‌کار", value: "عالی" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "اولویت‌بندی خودکار گزارش‌های اورژانسی قبل از ساعت ۱۰", impact: "high" },
      { id: "o2", suggestion: "ادغام یادآوری WhatsApp برای بیماران بدون ایمیل", impact: "medium" },
    ],
    previewSteps: [
      "ورود DICOM از PACS",
      "اعلان رادیولوژیست",
      "کنترل کیفیت AI",
      "نگارش پزشک",
      "تأیید و PDF",
      "ارسال به بیمار",
    ],
    trigger: { type: "event", event: "mri-completed" },
    conditions: [{ id: "c1", field: "modality", operator: "eq", value: "MRI" }],
    actions: [
      { id: "a1", type: "notify", recipient: "radiologist", message: "تصاویر MRI بیمار {نام} آماده بررسی است." },
      { id: "a2", type: "generate-report", recipient: "system", message: "تولید PDF گزارش تأییدشده." },
      { id: "a3", type: "send-sms", recipient: "patient", message: "نتیجه MRI شما آماده است." },
    ],
    lastRun: "۱۵ دقیقه پیش",
    runsToday: 18,
    successRate: 98,
    runs: [
      { id: "r1", time: "امروز ۱۱:۴۵", status: "success", detail: "بیمار ۲۱۴ — PDF ارسال شد" },
      { id: "r2", time: "امروز ۱۱:۲۰", status: "success", detail: "بیمار ۲۰۸ — تأیید رادیولوژیست" },
    ],
  }),

  scenario({
    id: "wf-tomorrow-appointments",
    name: "مدیریت نوبت‌های فردا",
    description:
      "هر شب: بارگذاری نوبت‌های فردا، تشخیص تداخل، اسلات خالی، یادآوری، تأیید و پر کردن لغوشده‌ها.",
    category: "automation",
    executiveSummary:
      "هر شب ساعت ۲۲:۰۰ نوبت‌های فردا تحلیل می‌شوند. ۸۵٪ لغوها در ۴۸ ساعت با بیمار جایگزین پر می‌شوند و نرخ غیبت ۲۳٪ کاهش یافته است.",
    automationScore: 91,
    connectedSystems: ["Calendar", "SMS", "WhatsApp", "Appointment System"],
    approvals: [{ role: "مسئول پذیرش", required: false }],
    performance: {
      avgDuration: "۴ دقیقه",
      timeSaved: "۱.۸ ساعت/شب",
      estimatedROI: "۱۸M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "نوبت‌های فردا", value: "۴۷" },
      { id: "w2", label: "تداخل‌ها", value: "۱" },
      { id: "w3", label: "اسلات خالی", value: "۶" },
      { id: "w4", label: "تأیید بیمار", value: "۸۹٪" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "پیشنهاد خودکار نوبت جایگزین بر اساس فاصله محل سکونت", impact: "high" },
    ],
    previewSteps: ["بارگذاری نوبت‌ها", "تشخیص تداخل", "یادآوری SMS", "تأیید بیمار", "پر کردن لغو"],
    trigger: { type: "schedule", frequency: "daily", time: "22:00" },
    actions: [
      { id: "a1", type: "send-sms", recipient: "patient", message: "یادآوری نوبت فردا ساعت {ساعت}." },
      { id: "a2", type: "notify", recipient: "reception", message: "فهرست نوبت‌های فردا آماده است." },
    ],
    lastRun: "دیشب ۲۲:۰۰",
    runsToday: 1,
    successRate: 97,
    runs: [{ id: "r1", time: "دیشب ۲۲:۰۰", status: "success", detail: "۴۷ نوبت — ۳ یادآوری ارسال شد" }],
  }),

  scenario({
    id: "wf-insurance-check",
    name: "بررسی وضعیت بیمه",
    description:
      "هنگام ورود بیمار: استعلام بیمه، اعتبار پوشش، محاسبه سهم بیمار، اطلاع پذیرش و ثبت مالی.",
    category: "finance-insurance",
    executiveSummary:
      "در لحظه پذیرش، پوشش بیمه‌ای بیمار از ۶ بیمه اصلی استعلام و سهم پرداختی محاسبه می‌شود. خطاهای صورتحساب ۶۷٪ کاهش یافته است.",
    automationScore: 88,
    connectedSystems: ["Insurance API", "Accounting", "Patient Database"],
    approvals: [{ role: "مسئول پذیرش", required: true }],
    performance: {
      avgDuration: "۴۵ ثانیه",
      timeSaved: "۳ ساعت/روز",
      estimatedROI: "۲۸M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "استعلام امروز", value: "۳۴" },
      { id: "w2", label: "پوشش تأییدشده", value: "۹۱٪" },
      { id: "w3", label: "نیاز به بررسی", value: "۳" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "پیش‌بینی رد پوشش بر اساس سابقه بیمه", impact: "medium" },
    ],
    previewSteps: ["ورود بیمار", "استعلام بیمه", "محاسبه سهم", "اعلان پذیرش", "ثبت مالی"],
    trigger: { type: "event", event: "patient-checked-in" },
    actions: [
      { id: "a1", type: "notify", recipient: "reception", message: "پوشش بیمه {نام} تأیید شد — سهم: {مبلغ}." },
      { id: "a2", type: "create-task", recipient: "accounting", message: "ثبت سند مالی بیمار {نام}." },
    ],
    lastRun: "۸ دقیقه پیش",
    runsToday: 34,
    successRate: 96,
    runs: [{ id: "r1", time: "امروز ۱۱:۵۲", status: "success", detail: "بیمار ۲۱۶ — بیمه تأمین اجتماعی" }],
  }),

  scenario({
    id: "wf-auto-results",
    name: "ارسال خودکار نتایج",
    description:
      "پس از تأیید گزارش: PDF امن، لینک دانلود، SMS، WhatsApp، Email و ردیابی تحویل و باز شدن.",
    category: "imaging",
    executiveSummary:
      "نتایج تأییدشده در کمتر از ۲ دقیقه از کانال ترجیحی بیمار ارسال می‌شوند. نرخ باز شدن لینک ۷۸٪ و رضایت ۹۴٪ گزارش شده است.",
    automationScore: 93,
    connectedSystems: ["Email", "SMS", "WhatsApp", "Secure Storage"],
    approvals: [{ role: "رادیولوژیست", required: true }],
    performance: {
      avgDuration: "۱.۸ دقیقه",
      timeSaved: "۴ ساعت/روز",
      estimatedROI: "۳۵M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "ارسال امروز", value: "۲۱" },
      { id: "w2", label: "نرخ تحویل", value: "۹۹٪" },
      { id: "w3", label: "نرخ باز شدن", value: "۷۸٪" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "انتخاب خودکار کانال بر اساس سابقه تعامل بیمار", impact: "high" },
    ],
    previewSteps: ["تأیید گزارش", "PDF امن", "لینک دانلود", "SMS + WhatsApp", "ردیابی"],
    trigger: { type: "event", event: "report-ready" },
    actions: [
      { id: "a1", type: "send-sms", recipient: "patient", message: "نتیجه آماده — لینک امن: {link}" },
      { id: "a2", type: "send-email", recipient: "patient", message: "گزارش تصویربرداری پیوست است." },
    ],
    lastRun: "۲۲ دقیقه پیش",
    runsToday: 21,
    successRate: 99,
    runs: [{ id: "r1", time: "امروز ۱۱:۳۸", status: "success", detail: "بیمار ۱۹۸ — WhatsApp + SMS" }],
  }),

  scenario({
    id: "wf-report-delay-alert",
    name: "هشدار تأخیر گزارش‌ها",
    description:
      "گزارش بیش از ۲ ساعت: اطلاع پزشک. ۴ ساعت: مدیر بخش. ۶ ساعت: مدیر مرکز. هشدار داشبورد.",
    category: "analytics",
    executiveSummary:
      "سیستم تأخیر گزارش را در سه سطح تشدید می‌کند. میانگین زمان انتظار گزارش از ۳.۲ ساعت به ۱.۴ ساعت رسیده است.",
    automationScore: 86,
    connectedSystems: ["RIS", "Notification System", "Dashboard"],
    approvals: [
      { role: "رادیولوژیست", required: true },
      { role: "مدیر بخش", required: true },
      { role: "مدیر مرکز", required: false },
    ],
    performance: {
      avgDuration: "فوری",
      timeSaved: "۱.۵ ساعت/روز",
      estimatedROI: "۲۲M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "گزارش معوق", value: "۳", trend: "+۱" },
      { id: "w2", label: "میانگین تأخیر", value: "۱.۴ ساعت" },
      { id: "w3", label: "عملکرد پزشکان", value: "↑" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "پیش‌بینی گزارش‌های معوق بر اساس بار کاری پزشک", impact: "high" },
    ],
    previewSteps: [">۲ ساعت", "اطلاع پزشک", ">۴ ساعت مدیر", ">۶ ساعت مدیر مرکز", "هشدار داشبورد"],
    trigger: { type: "schedule", frequency: "interval", intervalMinutes: 30 },
    conditions: [{ id: "c1", field: "report-wait", operator: "gt", value: "120" }],
    actions: [
      { id: "a1", type: "notify", recipient: "radiologist", message: "گزارش {id} بیش از ۲ ساعت در انتظار است." },
      { id: "a2", type: "notify", recipient: "dept-manager", message: "تشدید — گزارش {id} بیش از ۴ ساعت." },
    ],
    lastRun: "۳۰ دقیقه پیش",
    runsToday: 8,
    successRate: 100,
    health: "warning",
    issue: "۳ گزارش بیش از ۲ ساعت در انتظار — یادآوری سطح ۱ ارسال شد.",
    runs: [{ id: "r1", time: "امروز ۱۱:۳۰", status: "success", detail: "۲ هشدار سطح ۱ — ۱ هشدار سطح ۲" }],
  }),

  scenario({
    id: "wf-device-health",
    name: "پایش سلامت دستگاه‌ها",
    description:
      "هر صبح: QC، جمع‌آوری diagnostics، تحلیل روند AI، تشخیص ناهنجاری، تیکت تعمیر و اطلاع مهندس.",
    category: "automation",
    executiveSummary:
      "QC صبحگاهی ۳ MRI، ۲ CT و ۴ سونوگرافی اجرا می‌شود. خرابی پیش‌دستانه ۴۰٪ کاهش و downtime ۱۸٪ کمتر شده است.",
    automationScore: 90,
    connectedSystems: ["MRI", "CT", "Ultrasound", "Maintenance System"],
    approvals: [{ role: "مهندس بیomedical", required: true }],
    performance: {
      avgDuration: "۱۲ دقیقه",
      timeSaved: "۲ ساعت/روز",
      estimatedROI: "۵۵M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "QC امروز", value: "۹/۹" },
      { id: "w2", label: "ناهنجاری", value: "۱" },
      { id: "w3", label: "تیکت باز", value: "۲" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "پیش‌بینی خرابی MRI-2 بر اساس روند دما", impact: "high" },
    ],
    previewSteps: ["QC صبحگاهی", "Diagnostics", "تحلیل AI", "تیکت تعمیر", "اطلاع مهندس"],
    trigger: { type: "schedule", frequency: "daily", time: "07:00" },
    conditions: [{ id: "c1", field: "qc-result", operator: "eq", value: "ناموفق" }],
    actions: [
      { id: "a1", type: "notify", recipient: "biomedical", message: "QC {دستگاه} ناموفق — بررسی فوری." },
      { id: "a2", type: "create-task", recipient: "maintenance", message: "تیکت تعمیر {دستگاه}." },
    ],
    lastRun: "امروز ۰۷:۱۲",
    runsToday: 1,
    successRate: 94,
    health: "warning",
    issue: "MRI شماره ۲ — انحراف جزئی در coil calibration. مهندس در جریان است.",
    runs: [{ id: "r1", time: "امروز ۰۷:۱۲", status: "success", detail: "۸ سالم — ۱ هشدار MRI-2" }],
  }),

  scenario({
    id: "wf-patient-admission",
    name: "پذیرش بیمار",
    description:
      "اسکن کد ملی، یافتن پرونده، ایجاد رکورد، تأیید بیمه، شماره نوبت و چاپ رسید.",
    category: "patient-ops",
    executiveSummary:
      "پذیرش کامل در ۹۰ ثانیه انجام می‌شود. صف انتظار ۳۵٪ کوتاه‌تر و خطای ثبت پرونده ۹۲٪ کاهش یافته است.",
    automationScore: 85,
    connectedSystems: ["Patient Database", "Insurance API", "Queue System", "Printer"],
    approvals: [{ role: "مسئول پذیرش", required: false }],
    performance: {
      avgDuration: "۹۰ ثانیه",
      timeSaved: "۵ ساعت/روز",
      estimatedROI: "۳۰M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "پذیرش امروز", value: "۳۴" },
      { id: "w2", label: "میانگین زمان", value: "۱.۵ دقیقه" },
      { id: "w3", label: "صف فعلی", value: "۴" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "پیش‌پر کردن فرم از OCR کارت ملی", impact: "medium" },
    ],
    previewSteps: ["اسکن کد ملی", "یافتن پرونده", "تأیید بیمه", "شماره نوبت", "چاپ رسید"],
    trigger: { type: "event", event: "patient-arrival" },
    actions: [
      { id: "a1", type: "create-task", recipient: "reception", message: "پرونده {نام} آماده — نوبت {شماره}." },
    ],
    lastRun: "۵ دقیقه پیش",
    runsToday: 34,
    successRate: 99,
    runs: [{ id: "r1", time: "امروز ۱۱:۵۵", status: "success", detail: "بیمار ۲۲۰ — نوبت A-034" }],
  }),

  scenario({
    id: "wf-daily-analytics",
    name: "تحلیل عملکرد روزانه",
    description:
      "هر شب: جمع‌آوری داده عملیاتی، زمان انتظار، گزارش‌ها، درآمد، رد شده‌ها و خلاصه اجرایی AI.",
    category: "analytics",
    executiveSummary:
      "هر شب ساعت ۲۳:۰۰ گزارش اجرایی برای مدیرعامل تولید می‌شود. داشبورد مرکز فرمان خودکار به‌روز می‌شود.",
    automationScore: 92,
    connectedSystems: ["Dashboard", "RIS", "Accounting", "OpenAI"],
    approvals: [{ role: "مدیرعامل", required: false }],
    performance: {
      avgDuration: "۶ دقیقه",
      timeSaved: "۲ ساعت/شب",
      estimatedROI: "—",
    },
    dashboardWidgets: [
      { id: "w1", label: "درآمد امروز", value: "۴۸.۲M" },
      { id: "w2", label: "گزارش‌ها", value: "۲۸" },
      { id: "w3", label: "زمان انتظار", value: "۱۸ دقیقه" },
      { id: "w4", label: "خلاصه AI", value: "آماده" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "افزودن مقایسه با هفته گذشته در خلاصه", impact: "low" },
    ],
    previewSteps: ["جمع‌آوری داده", "تحلیل KPI", "خلاصه AI", "به‌روز داشبورد"],
    trigger: { type: "schedule", frequency: "daily", time: "23:00" },
    actions: [
      { id: "a1", type: "generate-report", recipient: "director", message: "خلاصه اجرایی روزانه مرکز." },
      { id: "a2", type: "notify", recipient: "director", message: "داشبورد مرکز فرمان به‌روز شد." },
    ],
    lastRun: "دیشب ۲۳:۰۵",
    runsToday: 1,
    successRate: 100,
    runs: [{ id: "r1", time: "دیشب ۲۳:۰۵", status: "success", detail: "خلاصه ۲۸ گزارش — درآمد ۴۸.۲M" }],
  }),

  scenario({
    id: "wf-vip-patient",
    name: "بیمار VIP",
    description:
      "ورود VIP: اطلاع پذیرش، رزرو اتاق، اطلاع رادیولوژیست، اولویت گزارش و پیگیری شخصی.",
    category: "patient-ops",
    executiveSummary:
      "بیماران VIP مسیر اختصاصی دارند. زمان کل مراجعه ۴۵٪ کمتر و رضایت ۱۰۰٪ در ۳ ماه گذشته.",
    automationScore: 87,
    connectedSystems: ["Patient Database", "Room Scheduler", "SMS", "RIS"],
    approvals: [{ role: "مدیر پذیرش", required: true }],
    performance: {
      avgDuration: "۲۵ دقیقه",
      timeSaved: "۴۵ دقیقه/VIP",
      estimatedROI: "—",
    },
    dashboardWidgets: [
      { id: "w1", label: "VIP امروز", value: "۲" },
      { id: "w2", label: "اتاق اختصاصی", value: "رزرو" },
    ],
    aiOptimizations: [],
    previewSteps: ["شناسایی VIP", "رزرو اتاق", "اولویت گزارش", "پیگیری شخصی"],
    trigger: { type: "event", event: "vip-arrival" },
    conditions: [{ id: "c1", field: "patient-tier", operator: "eq", value: "VIP" }],
    actions: [
      { id: "a1", type: "notify", recipient: "reception", message: "بیمار VIP {نام} — مسیر اختصاصی." },
      { id: "a2", type: "notify", recipient: "radiologist", message: "اولویت گزارش VIP {نام}." },
    ],
    lastRun: "۲ ساعت پیش",
    runsToday: 2,
    successRate: 100,
    runs: [{ id: "r1", time: "امروز ۱۰:۰۰", status: "success", detail: "دکتر احمدی — اتاق VIP-1" }],
  }),

  scenario({
    id: "wf-emergency-patient",
    name: "بیمار اورژانسی",
    description:
      "ورود اورژانس: تریاژ فوری، رزرو اسکنر، اطلاع رادیولوژیست، اولویت گزارش و اطلاع پزشک ارجاع‌دهنده.",
    category: "patient-ops",
    executiveSummary:
      "بیماران اورژانسی در کمتر از ۵ دقیقه اسکن می‌شوند. SLA گزارش ۳۰ دقیقه با ۹۷٪ رعایت.",
    automationScore: 95,
    connectedSystems: ["RIS", "PACS", "SMS", "Phone"],
    approvals: [{ role: "رادیولوژیست", required: true }],
    performance: {
      avgDuration: "۲۸ دقیقه",
      timeSaved: "حیاتی",
      estimatedROI: "—",
    },
    dashboardWidgets: [
      { id: "w1", label: "اورژانس امروز", value: "۱" },
      { id: "w2", label: "SLA گزارش", value: "۹۷٪" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "اتصال مستقیم به سیستم ER بیمارستان", impact: "high" },
    ],
    previewSteps: ["تریاژ", "رزرو اسکنر", "اسکن فوری", "گزارش اولویت", "اطلاع پزشک"],
    trigger: { type: "event", event: "emergency-patient" },
    actions: [
      { id: "a1", type: "notify", recipient: "radiologist", message: "اورژانس — بیمار {نام} در صف فوری." },
      { id: "a2", type: "notify", recipient: "referring-physician", message: "گزارش اولیه آماده — تماس فوری." },
    ],
    lastRun: "۴ ساعت پیش",
    runsToday: 1,
    successRate: 97,
    runs: [{ id: "r1", time: "امروز ۰۸:۱۵", status: "success", detail: "تروما CT — گزارش ۲۲ دقیقه" }],
  }),

  scenario({
    id: "wf-critical-report",
    name: "گزارش بحرانی",
    description:
      "یافته بحرانی: تأیید AI، تماس فوری، SMS، WhatsApp، ثبت تأیید و اطلاع مدیریت.",
    category: "ai",
    executiveSummary:
      "یافته‌های بحرانی در ۳ دقیقه به پزشک ارجاع‌دهنده و بیمار اطلاع می‌شوند. ۱۰۰٪ موارد در ۶ ماه گذشته تأیید شده‌اند.",
    automationScore: 97,
    connectedSystems: ["RIS", "SMS", "WhatsApp", "Phone", "Audit Log"],
    approvals: [
      { role: "رادیولوژیست", required: true },
      { role: "مدیر پزشکی", required: true },
    ],
    performance: {
      avgDuration: "۳ دقیقه",
      timeSaved: "حیاتی",
      estimatedROI: "—",
    },
    dashboardWidgets: [
      { id: "w1", label: "بحرانی امروز", value: "۰" },
      { id: "w2", label: "زمان اطلاع", value: "<۳ دقیقه" },
    ],
    aiOptimizations: [],
    previewSteps: ["یافته بحرانی", "تأیید AI", "تماس فوری", "SMS + WhatsApp", "ثبت + مدیریت"],
    trigger: { type: "event", event: "critical-finding" },
    actions: [
      { id: "a1", type: "notify", recipient: "referring-physician", message: "یافته بحرانی — تماس فوری." },
      { id: "a2", type: "send-sms", recipient: "patient", message: "لطفاً فوراً با مرکز تماس بگیرید." },
    ],
    lastRun: "۳ روز پیش",
    runsToday: 0,
    successRate: 100,
    runs: [{ id: "r1", time: "۳ روز پیش", status: "success", detail: "آنوریسم — تماس ۲ دقیقه" }],
  }),

  scenario({
    id: "wf-ai-detected",
    name: "گزارش‌های آماده و بیماران منتظر",
    description:
      "THEMACHINE این گردش‌کار را از ۳۷ درخواست تکراری در گفتگو شناسایی و ساخت.",
    category: "ai",
    source: "ai",
    createdFrom: "الگوی تکراری در گفتگو — ۳۷ بار در ۱۰ روز",
    whyAICreated:
      "مدیرعامل به‌طور مکرر در گفتگو با THEMACHINE پرسید: «کدام گزارش‌ها آماده‌اند؟»، «کدام بیماران منتظرند؟»، «امروز درآمد چقدر بوده؟» و «کدام پزشک تأخیر دارد؟» THEMACHINE این ۴ سوال را به یک فرآیند واحد تبدیل کرد.",
    conversationOrigin: {
      detectedAt: "۱۴۰۴/۰۱/۱۸",
      repeatCount: 37,
      repeatPeriodDays: 10,
      sampleQueries: [
        "کدام گزارش‌ها آماده هستند؟",
        "کدام بیماران منتظرند؟",
        "امروز درآمد چقدر بوده؟",
        "کدام پزشک تأخیر دارد؟",
      ],
      conversationExcerpt:
        "شما این ۴ سوال را ۳۷ بار در ۱۰ روز گذشته پرسیده‌اید. آیا می‌خواهید THEMACHINE این فرآیند را خودکار کند؟",
    },
    executiveSummary:
      "ویژگی امضای THEMACHINE: یادگیری از گفتگو، شناسایی الگو، پیشنهاد خودکارسازی و ساخت داشبورد. این گردش‌کار هر صبح خلاصه عملیاتی تولید می‌کند.",
    automationScore: 98,
    connectedSystems: ["RIS", "Dashboard", "OpenAI", "Patient Database"],
    approvals: [{ role: "مدیرعامل", required: true }],
    performance: {
      avgDuration: "۲ دقیقه",
      timeSaved: "۴۵ دقیقه/روز",
      estimatedROI: "۳۸M تومان/ماه",
    },
    dashboardWidgets: [
      { id: "w1", label: "گزارش‌های آماده", value: "۱۲" },
      { id: "w2", label: "بیماران منتظر", value: "۵" },
      { id: "w3", label: "درآمد امروز", value: "۴۸.۲M" },
      { id: "w4", label: "پزشک تأخیردار", value: "۱" },
      { id: "w5", label: "سلامت گردش‌کار", value: "۹۸٪" },
    ],
    aiOptimizations: [
      { id: "o1", suggestion: "افزودن پیش‌بینی بار کاری بعدازظهر", impact: "medium" },
    ],
    previewSteps: ["شناسایی الگو", "پیشنهاد AI", "تأیید مدیر", "ساخت گردش‌کار", "داشبورد"],
    trigger: { type: "schedule", frequency: "daily", time: "08:30" },
    actions: [
      { id: "a1", type: "generate-report", recipient: "director", message: "خلاصه گزارش‌های آماده و بیماران منتظر." },
      { id: "a2", type: "notify", recipient: "director", message: "ویجت‌های داشبورد به‌روز شد." },
    ],
    lastRun: "امروز ۰۸:۳۰",
    runsToday: 1,
    successRate: 100,
    runs: [{ id: "r1", time: "امروز ۰۸:۳۰", status: "success", detail: "۱۲ گزارش آماده — ۵ بیمار منتظر" }],
  }),
];

/** AI-proposed draft from chat detection (scenario 12 variant) */
export function buildOperationalSummaryDraft(): Workflow {
  const base = imagingWorkflowsSeed.find((w) => w.id === "wf-ai-detected")!;
  return {
    ...base,
    id: "wf-ai-draft-operational",
    enabled: false,
    runsToday: 0,
    lastRun: "—",
    runs: [],
  };
}

/** @deprecated Use imagingWorkflowsSeed */
export const ctWorkflowsSeed = imagingWorkflowsSeed;
export const buildDoseReportDraft = buildOperationalSummaryDraft;
