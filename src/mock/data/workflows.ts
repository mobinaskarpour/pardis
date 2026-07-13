import type { Workflow } from "@/types/workflow";

/** Demo workflows for the CT department — the user is the department manager. */
export const ctWorkflowsSeed: Workflow[] = [
  {
    id: "wf-contrast-allergy",
    name: "بررسی آلرژی ماده حاجب",
    description:
      "پیش از هر CT با ماده حاجب، سابقه آلرژی بیمار بررسی و در صورت وجود سابقه، به تکنسین و پرستار هشدار داده می‌شود.",
    enabled: true,
    health: "ok",
    source: "manual",
    trigger: { type: "event", event: "contrast-appointment" },
    conditions: [
      { id: "c1", field: "allergy-history", operator: "eq", value: "دارد" },
    ],
    actions: [
      {
        id: "a1",
        type: "notify",
        recipient: "ct-tech",
        message: "بیمار {نام بیمار} سابقه آلرژی به ماده حاجب دارد — پروتکل پیش‌دارو بررسی شود.",
      },
      {
        id: "a2",
        type: "create-task",
        recipient: "nurse",
        message: "آماده‌سازی پیش‌دارو برای بیمار {نام بیمار} پیش از نوبت {ساعت نوبت}.",
      },
    ],
    lastRun: "۲۵ دقیقه پیش",
    runsToday: 6,
    successRate: 99,
    runs: [
      { id: "r1", time: "امروز ۱۱:۳۵", status: "success", detail: "بیمار ۲۰۸ — هشدار به تکنسین ارسال شد" },
      { id: "r2", time: "امروز ۱۰:۱۰", status: "success", detail: "بیمار ۱۹۶ — بدون سابقه آلرژی، رد شد" },
      { id: "r3", time: "امروز ۰۹:۰۵", status: "success", detail: "بیمار ۱۸۹ — وظیفه پیش‌دارو ثبت شد" },
    ],
  },
  {
    id: "wf-report-followup",
    name: "پیگیری گزارش‌های امضانشده",
    description:
      "هر روز صبح گزارش‌های CT که بیش از ۲۴ ساعت در انتظار امضای رادیولوژیست مانده‌اند شناسایی و یادآوری ارسال می‌شود.",
    enabled: true,
    health: "warning",
    source: "manual",
    trigger: { type: "schedule", frequency: "daily", time: "08:00" },
    conditions: [
      { id: "c1", field: "report-wait", operator: "gt", value: "24" },
    ],
    actions: [
      {
        id: "a1",
        type: "notify",
        recipient: "radiologist-oncall",
        message: "گزارش {شماره پرونده} بیش از ۲۴ ساعت در انتظار امضا است.",
      },
      {
        id: "a2",
        type: "send-email",
        recipient: "ct-manager",
        message: "فهرست گزارش‌های معوق امروز پیوست است.",
      },
    ],
    lastRun: "امروز ۰۸:۰۰",
    runsToday: 1,
    successRate: 96,
    issue: "۲ گزارش بیش از ۴۸ ساعت در انتظار امضا هستند — یادآوری دوم ارسال شد اما پاسخی ثبت نشده است.",
    runs: [
      { id: "r1", time: "امروز ۰۸:۰۰", status: "success", detail: "۲ گزارش معوق — یادآوری ارسال شد" },
      { id: "r2", time: "دیروز ۰۸:۰۰", status: "success", detail: "۳ گزارش معوق — یادآوری ارسال شد" },
      { id: "r3", time: "پریروز ۰۸:۰۰", status: "success", detail: "بدون گزارش معوق" },
    ],
  },
  {
    id: "wf-daily-qc",
    name: "کنترل کیفی روزانه دستگاه‌ها",
    description:
      "هر روز پیش از شروع کار، تست QC هر دو دستگاه CT اجرا، نتیجه ثبت و در صورت خطا به مهندس تجهیزات اطلاع داده می‌شود.",
    enabled: true,
    health: "error",
    source: "manual",
    trigger: { type: "schedule", frequency: "daily", time: "07:00" },
    conditions: [
      { id: "c1", field: "qc-result", operator: "eq", value: "ناموفق" },
    ],
    actions: [
      {
        id: "a1",
        type: "notify",
        recipient: "equip-engineer",
        message: "تست QC دستگاه {شماره دستگاه} ناموفق بود — بررسی فوری لازم است.",
      },
      {
        id: "a2",
        type: "create-task",
        recipient: "ct-manager",
        message: "تصمیم‌گیری درباره ادامه کار دستگاه {شماره دستگاه}.",
      },
    ],
    lastRun: "امروز ۰۷:۰۰ — ناموفق",
    runsToday: 1,
    successRate: 88,
    issue: "تست QC دستگاه شماره ۲ امروز ناموفق بود. مهندس تجهیزات در جریان است؛ دستگاه تا تأیید مجدد از مدار خارج شده.",
    runs: [
      { id: "r1", time: "امروز ۰۷:۰۰", status: "failed", detail: "دستگاه ۲ — انحراف کالیبراسیون خارج از محدوده" },
      { id: "r2", time: "دیروز ۰۷:۰۰", status: "success", detail: "هر دو دستگاه سالم" },
      { id: "r3", time: "پریروز ۰۷:۰۰", status: "success", detail: "هر دو دستگاه سالم" },
    ],
  },
  {
    id: "wf-noshow-sms",
    name: "پیامک نوبت‌های ازدست‌رفته",
    description:
      "برای بیمارانی که در نوبت CT حاضر نشده‌اند، پیامک نوبت‌دهی مجدد با لینک رزرو ارسال می‌شود.",
    enabled: true,
    health: "ok",
    source: "ai",
    createdFrom: "الگوی تکراری در گفتگو — درخواست‌های مکرر پیگیری بیماران غایب",
    trigger: { type: "event", event: "no-show" },
    conditions: [],
    actions: [
      {
        id: "a1",
        type: "send-sms",
        recipient: "patient",
        message: "بیمار گرامی، نوبت CT شما از دست رفت. برای رزرو مجدد با ۰۲۱-۸۸۷۷۶۶۵۵ تماس بگیرید.",
      },
    ],
    lastRun: "۱ ساعت پیش",
    runsToday: 3,
    successRate: 100,
    runs: [
      { id: "r1", time: "امروز ۱۱:۰۰", status: "success", detail: "پیامک به بیمار ۲۰۱ ارسال شد" },
      { id: "r2", time: "امروز ۰۹:۳۰", status: "success", detail: "پیامک به بیمار ۱۸۴ ارسال شد" },
    ],
  },
  {
    id: "wf-dose-monthly",
    name: "گزارش ماهانه دوز تجمعی",
    description:
      "پایان هر ماه، گزارش دوز تجمعی بیماران پرتکرار برای کمیته حفاظت پرتویی تهیه می‌شود.",
    enabled: false,
    health: "ok",
    source: "manual",
    trigger: { type: "schedule", frequency: "weekly", time: "18:00" },
    conditions: [
      { id: "c1", field: "dose", operator: "gt", value: "50" },
    ],
    actions: [
      {
        id: "a1",
        type: "generate-report",
        recipient: "health-physics",
        message: "گزارش دوز تجمعی بیماران با دوز بالای ۵۰ mSv.",
      },
    ],
    lastRun: "۲ هفته پیش",
    runsToday: 0,
    successRate: 92,
    runs: [
      { id: "r1", time: "۲ هفته پیش", status: "success", detail: "گزارش برای ۴ بیمار تهیه شد" },
    ],
  },
];

/**
 * The workflow the AI proposes when it detects the repeated
 * "send today's dose report" request in the chat.
 */
export function buildDoseReportDraft(): Workflow {
  return {
    id: "wf-dose-report",
    name: "ارسال گزارش دوز روزانه به فیزیک بهداشت",
    description:
      "در پایان هر روز کاری، گزارش دوز بیماران بخش سی‌تی به‌صورت خودکار تهیه و برای واحد فیزیک بهداشت ارسال می‌شود.",
    enabled: true,
    health: "ok",
    source: "ai",
    createdFrom: "الگوی تکراری در گفتگو — ۳ درخواست مشابه در ۳ روز اخیر",
    trigger: { type: "schedule", frequency: "daily", time: "20:00" },
    conditions: [
      { id: "c1", field: "scan-count", operator: "gt", value: "0" },
    ],
    actions: [
      {
        id: "a1",
        type: "generate-report",
        recipient: "health-physics",
        message: "گزارش دوز روزانه بیماران CT — شامل دوز میانگین، بیشینه و موارد خارج از محدوده.",
      },
      {
        id: "a2",
        type: "send-email",
        recipient: "health-physics",
        message: "گزارش دوز روزانه بخش سی‌تی پیوست است.",
      },
      {
        id: "a3",
        type: "notify",
        recipient: "ct-manager",
        message: "گزارش دوز امروز برای فیزیک بهداشت ارسال شد.",
      },
    ],
    lastRun: "—",
    runsToday: 0,
    successRate: 100,
    runs: [],
  };
}
