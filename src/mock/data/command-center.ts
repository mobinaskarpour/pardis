export const user = {
  name: "دکتر اخلاق‌پور",
  role: "مدیر بخش سی‌تی اسکن",
  initials: "ا",
};

export const aiSummary = {
  greeting: "صبح بخیر دکتر اخلاق‌پور.",
  lines: [
    "امروز ۳۴ بیمار مراجعه کرده‌اند.",
    "سه گزارش نیاز به بررسی فوری دارند.",
    "دستگاه MRI شماره ۲ امروز بیشترین استفاده را داشته است.",
  ],
};

export const floatingMetrics = [
  {
    id: "patients",
    label: "بیماران امروز",
    value: "۲۴",
    numeric: 24,
    story: "۸ نفر منتظر تأیید پزشک",
    angle: -90,
    distance: 180,
  },
  {
    id: "revenue",
    label: "درآمد",
    value: "۴۸.۲M",
    story: "۱۲٪ بیشتر از دیروز",
    angle: -45,
    distance: 200,
  },
  {
    id: "mri",
    label: "MRI",
    value: "۱۶",
    numeric: 16,
    story: "دستگاه ۲ — پرکاربردترین",
    angle: 0,
    distance: 190,
  },
  {
    id: "doctors",
    label: "پزشکان",
    value: "۱۲",
    numeric: 12,
    story: "۲ نفر برنامه فشرده",
    angle: 45,
    distance: 200,
  },
  {
    id: "cases",
    label: "پرونده‌های باز",
    value: "۷",
    numeric: 7,
    story: "۳ مورد نیاز به پیگیری",
    angle: 90,
    distance: 180,
  },
  {
    id: "alerts",
    label: "هشدارها",
    value: "۲",
    numeric: 2,
    story: "۱ مورد فوری",
    angle: 135,
    distance: 195,
  },
  {
    id: "workflow",
    label: "Workflow",
    value: "۵",
    story: "۲ پیشنهاد AI جدید",
    angle: 180,
    distance: 185,
  },
  {
    id: "suggestion",
    label: "AI Suggestion",
    value: "۳",
    story: "پرونده ۲۱۴ را بررسی کنید",
    angle: -135,
    distance: 195,
  },
];

export const quickActions = [
  { id: "patient", label: "ثبت بیمار", icon: "user-plus" },
  { id: "report", label: "گزارش جدید", icon: "file-plus" },
  { id: "chat", label: "شروع گفتگوی AI", icon: "sparkles", href: "/chat" },
  { id: "mri", label: "ثبت MRI", icon: "scan" },
  { id: "ct", label: "ثبت CT", icon: "layers" },
  { id: "search", label: "جستجوی پرونده", icon: "search" },
];

export const timelineEvents = [
  {
    id: "1",
    time: "09:15",
    title: "MRI ثبت شد",
    detail: "پرونده احمدی — دستگاه ۲",
    type: "imaging" as const,
    imageUrl: "/media/imaging/mri-brain.svg",
  },
  {
    id: "2",
    time: "09:22",
    title: "پزشک گزارش را تأیید کرد",
    detail: "دکتر رضایی — CT شکم",
    type: "doctor" as const,
    imageUrl: "/media/doctors/dr-rezaei.jpg",
  },
  {
    id: "3",
    time: "09:35",
    title: "بیمار پیامک دریافت کرد",
    detail: "نوبت فردا — ۱۰:۳۰",
    type: "notification" as const,
  },
  {
    id: "4",
    time: "09:42",
    title: "هوش مصنوعی پیشنهاد ورک‌فلو جدید داد",
    detail: "اتوماسیون پیگیری MRI",
    type: "ai" as const,
  },
  {
    id: "5",
    time: "09:58",
    title: "پرونده جدید ثبت شد",
    detail: "مریم کریمی — سونوگرافی",
    type: "patient" as const,
    imageUrl: "/media/avatars/patient-198.jpg",
  },
  {
    id: "6",
    time: "10:05",
    title: "گزارش آماده بررسی",
    detail: "MRI مغز — پرونده ۲۱۴",
    type: "report" as const,
    imageUrl: "/media/imaging/mri-brain-photo.jpg",
  },
  {
    id: "7",
    time: "10:18",
    title: "سونوگرافی بارداری",
    detail: "سارا احمدی — هفته ۲۴",
    type: "imaging" as const,
    imageUrl: "/media/imaging/ultrasound-ob.svg",
  },
  {
    id: "8",
    time: "10:32",
    title: "MRI زانو آماده",
    detail: "رضا موسوی — پرونده ۲۰۳",
    type: "imaging" as const,
    imageUrl: "/media/imaging/mri-knee.svg",
  },
  {
    id: "9",
    time: "10:45",
    title: "ماموگرافی تأیید شد",
    detail: "فاطمه رضایی — BI-RADS 1",
    type: "report" as const,
    imageUrl: "/media/imaging/mammography.svg",
  },
  {
    id: "10",
    time: "11:00",
    title: "CT سینه تکمیل شد",
    detail: "زهرا صادقی — دکتر اکبری",
    type: "imaging" as const,
    imageUrl: "/media/imaging/ct-scan-photo.jpg",
  },
];

export const aiSuggestions = [
  {
    id: "1",
    text: "پیشنهاد می‌کنم پرونده شماره ۲۱۴ را بررسی کنید.",
    priority: "high" as const,
  },
  {
    id: "2",
    text: "امروز درآمد نسبت به هفته گذشته ۸٪ کمتر است.",
    priority: "medium" as const,
  },
  {
    id: "3",
    text: "دو پزشک امروز برنامه بسیار فشرده دارند.",
    priority: "medium" as const,
  },
];

export const integrations = [
  { id: "whatsapp", name: "WhatsApp", status: "connected" as const },
  { id: "email", name: "Email", status: "connected" as const },
  { id: "pacs", name: "PACS", status: "connected" as const },
  { id: "crm", name: "CRM", status: "connected" as const },
  { id: "cloud", name: "Cloud Backup", status: "connected" as const },
];

export const aiThinkingStates = [
  "Analyzing today's activities...",
  "Finding anomalies...",
  "Preparing insights...",
];

export const commandPaletteItems = [
  { id: "1", category: "بیمار", title: "احمدی، محمد", subtitle: "پرونده ۲۱۴", imageUrl: "/media/avatars/patient-214.jpg" },
  { id: "2", category: "پزشک", title: "دکتر رضایی", subtitle: "رادیولوژی", imageUrl: "/media/doctors/dr-rezaei.jpg" },
  { id: "3", category: "تصویر", title: "MRI مغز", subtitle: "امروز — ۰۹:۱۵", imageUrl: "/media/imaging/mri-brain.svg" },
  { id: "4", category: "گزارش", title: "گزارش ماهانه", subtitle: "آماده بررسی" },
  { id: "5", category: "AI", title: "پرونده احمدی", subtitle: "دستور AI" },
  { id: "6", category: "Workflow", title: "پیگیری MRI", subtitle: "پیشنهاد AI" },
  { id: "7", category: "بیمار", title: "کریمی، مریم", subtitle: "پرونده ۱۹۸", imageUrl: "/media/avatars/patient-198.jpg" },
  { id: "8", category: "تصویر", title: "MRI زانو", subtitle: "رضا موسوی", imageUrl: "/media/imaging/mri-knee.svg" },
  { id: "9", category: "پزشک", title: "دکتر کریمی", subtitle: "MRI", imageUrl: "/media/doctors/dr-karimi.jpg" },
  { id: "10", category: "بیمار", title: "صادقی، زهرا", subtitle: "CT سینه", imageUrl: "/media/avatars/patient-189.jpg" },
];

export { dockItems } from "@/config/navigation";
