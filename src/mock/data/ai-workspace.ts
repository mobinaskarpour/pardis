import type {
  HistoryCategory,
  CanvasType,
  Citation,
  AIAction,
  WorkspaceMessage,
  Conversation,
  AIResponse,
  Patient,
} from "@/types";

/** @deprecated Use Patient from @/types */
export type PatientData = Patient;

export type {
  HistoryCategory,
  CanvasType,
  Citation,
  AIAction,
  WorkspaceMessage,
  Conversation,
  AIResponse,
};

export const historyCategories: {
  id: HistoryCategory;
  label: string;
}[] = [
  { id: "patients", label: "بیماران" },
  { id: "reports", label: "گزارش‌ها" },
  { id: "financial", label: "مالی" },
  { id: "workflow", label: "Workflow" },
  { id: "sessions", label: "جلسات" },
];

export const emptySuggestions = [
  "گزارش دوز امروز را برای فیزیک بهداشت بفرست",
  "امروز چه بیمارانی مراجعه کرده‌اند؟",
  "درآمد امروز چقدر است؟",
  "پرونده‌های باز",
  "ساخت Workflow",
];

export const thinkingSteps = [
  "AI در حال تحلیل...",
  "جمع‌آوری اطلاعات...",
  "بررسی پرونده‌ها...",
  "ساخت پاسخ...",
  "آماده شد.",
];

export const patientAhmadi: PatientData = {
  id: "214",
  name: "محمد احمدی",
  caseNumber: "۲۱۴",
  age: 45,
  gender: "مرد",
  doctor: "دکتر رضایی",
  specialty: "رادیولوژی",
  lastVisit: "۱۴۰۴/۰۱/۲۲",
  status: "فعال",
  aiSummary:
    "بیمار ۴۵ ساله با سابقه MRI مغز. آخرین تصویربرداری ۲ هفته پیش انجام شده. گزارش نیاز به بررسی فوری دارد.",
  timeline: [
    { date: "۱۴۰۴/۰۱/۲۲", event: "MRI مغز — دستگاه ۲", type: "imaging" },
    { date: "۱۴۰۴/۰۱/۱۸", event: "ویزیت دکتر رضایی", type: "visit" },
    { date: "۱۴۰۴/۰۱/۱۰", event: "ثبت پرونده", type: "register" },
    { date: "۱۴۰۳/۱۲/۲۸", event: "CT شکم — نرمال", type: "imaging" },
  ],
  mri: [
    {
      date: "۱۴۰۴/۰۱/۲۲",
      type: "MRI مغز",
      device: "دستگاه ۲",
      status: "نیاز به بررسی",
    },
    {
      date: "۱۴۰۳/۱۱/۱۵",
      type: "MRI زانو",
      device: "دستگاه ۱",
      status: "تأیید شده",
    },
  ],
  reports: [
    {
      date: "۱۴۰۴/۰۱/۲۲",
      title: "گزارش MRI مغز",
      status: "در انتظار تأیید",
    },
    {
      date: "۱۴۰۳/۱۱/۱۶",
      title: "گزارش MRI زانو",
      status: "تأیید شده",
    },
  ],
};

export const patientsToday = [
  {
    id: "214",
    name: "محمد احمدی",
    time: "۰۹:۱۵",
    type: "MRI",
    status: "در انتظار",
    thumbnailUrl: "/media/imaging/mri-brain.svg",
  },
  {
    id: "198",
    name: "مریم کریمی",
    time: "۰۹:۴۵",
    type: "سونوگرافی",
    status: "تأیید شده",
    thumbnailUrl: "/media/imaging/ultrasound-abdomen.svg",
  },
  {
    id: "176",
    name: "علی محمدی",
    time: "۱۰:۰۰",
    type: "CT",
    status: "در حال انجام",
    thumbnailUrl: "/media/imaging/ct-abdomen.svg",
  },
  {
    id: "203",
    name: "رضا موسوی",
    time: "۱۰:۳۰",
    type: "MRI",
    status: "زمان‌بندی شده",
    thumbnailUrl: "/media/imaging/mri-knee.svg",
  },
  {
    id: "142",
    name: "حسین نوری",
    time: "۱۱:۰۰",
    type: "MRI",
    status: "زمان‌بندی شده",
    thumbnailUrl: "/media/imaging/mri-spine.svg",
  },
  {
    id: "165",
    name: "فاطمه رضایی",
    time: "۱۱:۳۰",
    type: "ماموگرافی",
    status: "تأیید شده",
    thumbnailUrl: "/media/imaging/mammography.svg",
  },
  {
    id: "128",
    name: "سارا احمدی",
    time: "۱۲:۰۰",
    type: "سونوگرافی",
    status: "در حال انجام",
    thumbnailUrl: "/media/imaging/ultrasound-ob.svg",
  },
  {
    id: "189",
    name: "زهرا صادقی",
    time: "۱۲:۳۰",
    type: "CT",
    status: "تأیید شده",
    thumbnailUrl: "/media/imaging/ct-abdomen.svg",
  },
  {
    id: "155",
    name: "امیر حسینی",
    time: "۱۳:۰۰",
    type: "MRI",
    status: "در انتظار",
    thumbnailUrl: "/media/imaging/mri-brain.svg",
  },
  {
    id: "091",
    name: "لیلا فرهادی",
    time: "۱۳:۳۰",
    type: "ماموگرافی",
    status: "زمان‌بندی شده",
    thumbnailUrl: "/media/imaging/mammography.svg",
  },
];

export const mriReady = [
  {
    id: "1",
    patientId: "214",
    patient: "محمد احمدی",
    caseNumber: "۲۱۴",
    type: "MRI مغز",
    device: "دستگاه ۲",
    time: "۰۹:۱۵",
    status: "آماده بررسی",
    thumbnailUrl: "/media/imaging/mri-brain.svg",
    previewUrl: "/media/imaging/mri-brain-photo.jpg",
    videoUrl: "/media/videos/mri-scan-demo.mp4",
  },
  {
    id: "2",
    patientId: "203",
    patient: "رضا موسوی",
    caseNumber: "۲۰۳",
    type: "MRI زانو",
    device: "دستگاه ۲",
    time: "۱۰:۳۰",
    status: "آماده بررسی",
    thumbnailUrl: "/media/imaging/mri-knee.svg",
  },
  {
    id: "3",
    patientId: "142",
    patient: "حسین نوری",
    caseNumber: "۱۴۲",
    type: "MRI ستون فقرات",
    device: "دستگاه ۱",
    time: "۰۸:۳۰",
    status: "آماده بررسی",
    thumbnailUrl: "/media/imaging/mri-spine.svg",
  },
  {
    id: "4",
    patientId: "155",
    patient: "امیر حسینی",
    caseNumber: "۱۵۵",
    type: "MRI شانه",
    device: "دستگاه ۱",
    time: "۱۱:۱۵",
    status: "در انتظار تأیید",
    thumbnailUrl: "/media/imaging/mri-brain.svg",
  },
  {
    id: "5",
    patientId: "176",
    patient: "علی محمدی",
    caseNumber: "۱۷۶",
    type: "MRI زانو",
    device: "دستگاه ۲",
    time: "۰۷:۴۵",
    status: "در انتظار تأیید",
    thumbnailUrl: "/media/imaging/mri-knee.svg",
  },
  {
    id: "6",
    patientId: "128",
    patient: "سارا احمدی",
    caseNumber: "۱۲۸",
    type: "سونوگرافی بارداری",
    device: "سونو ۲",
    time: "۱۶:۳۰",
    status: "در حال اسکن",
    thumbnailUrl: "/media/imaging/ultrasound-ob.svg",
    videoUrl: "/media/videos/ultrasound-demo.mp4",
  },
];

export const revenueData = {
  today: "۴۸.۲M",
  month: "۱.۲B",
  change: -8,
  trend: [42, 45, 38, 52, 48, 55, 48],
  breakdown: [
    { label: "MRI", value: "۵۲٪", amount: "۲۵.۱M" },
    { label: "CT", value: "۲۸٪", amount: "۱۳.۵M" },
    { label: "سونوگرافی", value: "۱۲٪", amount: "۵.۸M" },
    { label: "سایر", value: "۸٪", amount: "۳.۸M" },
  ],
};

export const initialConversations: Conversation[] = [
  {
    id: "conv-dose",
    title: "گزارش دوز CT",
    category: "reports",
    preview: "گزارش دوز امروز را برای فیزیک بهداشت بفرست",
    updatedAt: "دیروز",
    messages: [
      {
        id: "md1",
        role: "user",
        content: "گزارش دوز امروز بخش سی‌تی را برای فیزیک بهداشت بفرست",
      },
      {
        id: "md2",
        role: "assistant",
        content:
          "خلاصه برای مدیرعامل: گزارش دوز روز شنبه تهیه شد — ۳۱ اسکن، دوز میانگین ۸.۹ mSv — و برای واحد فیزیک بهداشت ارسال شد.",
        canvas: "report",
        reasoning: ["استخراج دوز از کنسول دستگاه‌ها", "ارسال به فیزیک بهداشت"],
        citations: [{ id: "cd0", source: "ct", label: "کنسول CT" }],
      },
      {
        id: "md3",
        role: "user",
        content: "گزارش دوز امروز را هم برای فیزیک بهداشت ارسال کن",
      },
      {
        id: "md4",
        role: "assistant",
        content:
          "خلاصه برای مدیرعامل: گزارش دوز روز یکشنبه تهیه شد — ۲۶ اسکن، دوز میانگین ۷.۸ mSv — و برای واحد فیزیک بهداشت ارسال شد.",
        canvas: "report",
        reasoning: ["استخراج دوز از کنسول دستگاه‌ها", "ارسال به فیزیک بهداشت"],
        citations: [{ id: "cd0b", source: "ct", label: "کنسول CT" }],
      },
    ],
  },
  {
    id: "conv-1",
    title: "پرونده احمدی",
    category: "patients",
    preview: "پرونده بیمار احمدی را باز کن",
    updatedAt: "امروز",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "پرونده بیمار احمدی را باز کن",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "پرونده محمد احمدی را باز کردم. سه MRI ثبت شده و یک گزارش نیاز به بررسی فوری دارد.",
        canvas: "patient",
        reasoning: [
          "اطلاعات از پرونده بیمار",
          "گزارش MRI",
          "تقویم پزشک",
        ],
        citations: [
          { id: "c1", source: "patient", label: "پرونده شماره ۲۱۴" },
          { id: "c2", source: "mri", label: "MRI مغز — ۱۴۰۴/۰۱/۲۲" },
          { id: "c3", source: "calendar", label: "برنامه دکتر رضایی" },
        ],
        suggestedQuestions: [
          "سوابق این بیمار",
          "آخرین MRI",
          "پزشک معالج",
          "هزینه درمان",
          "ثبت پیگیری",
        ],
        actions: [
          { id: "workflow", label: "ثبت Workflow" },
          { id: "report", label: "ساخت گزارش" },
          { id: "save", label: "ذخیره" },
          { id: "share", label: "اشتراک‌گذاری" },
        ],
      },
    ],
  },
  {
    id: "conv-2",
    title: "درآمد ماهانه",
    category: "financial",
    preview: "درآمد این ماه را نشان بده",
    updatedAt: "دیروز",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "درآمد این ماه را نشان بده",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "خلاصه مالی برای مدیرعامل: درآمد ماه جاری ۱.۲ میلیارد تومان است. نسبت به ماه گذشته ۸٪ کاهش داشته.",
        canvas: "revenue",
        reasoning: ["اطلاعات از سیستم مالی", "گزارش روزانه"],
        citations: [
          { id: "c4", source: "financial", label: "سیستم مالی" },
          { id: "c5", source: "report", label: "گزارش ماهانه" },
        ],
        suggestedQuestions: [
          "مقایسه با ماه گذشته",
          "پرکاربردترین دستگاه",
          "پیش‌بینی ماه آینده",
        ],
        actions: [
          { id: "report", label: "ساخت گزارش" },
          { id: "pdf", label: "تبدیل به PDF" },
        ],
      },
    ],
  },
  {
    id: "conv-3",
    title: "Workflow پیگیری MRI",
    category: "workflow",
    preview: "ساخت Workflow پیگیری MRI",
    updatedAt: "۲ روز پیش",
    messages: [
      {
        id: "m5",
        role: "user",
        content: "ساخت Workflow پیگیری MRI",
      },
      {
        id: "m6",
        role: "assistant",
        content: "Workflow پیگیری MRI آماده است. شامل ۴ مرحله اتوماتیک.",
        canvas: "workflow",
        reasoning: ["الگوهای Workflow موجود", "پرونده‌های MRI باز"],
        citations: [
          { id: "c6", source: "workflow", label: "الگوی پیگیری MRI" },
        ],
        suggestedQuestions: [
          "فعال‌سازی Workflow",
          "ویرایش مراحل",
          "تست Workflow",
        ],
        actions: [
          { id: "activate", label: "فعال‌سازی" },
          { id: "edit", label: "ویرایش" },
        ],
      },
    ],
  },
];
