import type { NodeCategory, NodeDefinition } from "@/types/workflow-studio";

export const nodeCategories: {
  id: NodeCategory;
  label: string;
  emoji: string;
}[] = [
  { id: "medical", label: "پزشکی", emoji: "🏥" },
  { id: "ai", label: "هوش مصنوعی", emoji: "🤖" },
  { id: "communication", label: "ارتباطات", emoji: "📨" },
  { id: "documents", label: "اسناد", emoji: "📄" },
  { id: "automation", label: "اتوماسیون", emoji: "⚙️" },
  { id: "financial", label: "مالی", emoji: "💰" },
  { id: "patient", label: "بیمار", emoji: "👥" },
  { id: "scheduling", label: "زمان‌بندی", emoji: "📅" },
  { id: "analytics", label: "تحلیل", emoji: "📊" },
  { id: "security", label: "امنیت", emoji: "🔒" },
];

export const nodeDefinitions: NodeDefinition[] = [
  // Medical
  { id: "patient-registered", category: "medical", title: "ثبت بیمار", description: "بیمار جدید ثبت شد", icon: "user-plus", color: "#2d5a7b", inputs: 0, outputs: 1 },
  { id: "patient-checked-in", category: "medical", title: "پذیرش بیمار", description: "بیمار در مرکز حاضر شد", icon: "user-check", color: "#4a7a96", inputs: 1, outputs: 1 },
  { id: "mri-completed", category: "medical", title: "MRI تکمیل شد", description: "اسکن MRI انجام شد", icon: "magnet", color: "#5b5fc7", inputs: 0, outputs: 1 },
  { id: "ct-completed", category: "medical", title: "CT تکمیل شد", description: "اسکن CT انجام شد", icon: "layers", color: "#6b7fc7", inputs: 0, outputs: 1 },
  { id: "ultrasound-completed", category: "medical", title: "سونوگرافی تکمیل", description: "سونوگرافی انجام شد", icon: "waves", color: "#c4a574", inputs: 0, outputs: 1 },
  { id: "report-ready", category: "medical", title: "گزارش آماده", description: "گزارش پزشک آماده است", icon: "file-check", color: "#4d8a5c", inputs: 1, outputs: 1 },
  { id: "doctor-approved", category: "medical", title: "تأیید پزشک", description: "پزشک گزارش را تأیید کرد", icon: "stethoscope", color: "#2d5a7b", inputs: 1, outputs: 1 },
  { id: "insurance-approved", category: "medical", title: "تأیید بیمه", description: "پوشش بیمه تأیید شد", icon: "shield-check", color: "#4da8a8", inputs: 1, outputs: 1 },
  { id: "invoice-created", category: "medical", title: "فاکتور صادر شد", description: "فاکتور بیمار ایجاد شد", icon: "receipt", color: "#b8943a", inputs: 1, outputs: 1 },
  { id: "appointment-reminder", category: "medical", title: "یادآوری نوبت", description: "یادآوری نوبت ارسال شود", icon: "bell-ring", color: "#5aabbf", inputs: 1, outputs: 1 },
  { id: "emergency-patient", category: "medical", title: "بیمار اورژانسی", description: "اولویت اورژانسی فعال", icon: "siren", color: "#b86b6b", inputs: 0, outputs: 1 },
  { id: "radiology-pacs", category: "medical", title: "Radiology PACS", description: "عملیات PACS", icon: "scan", color: "#2d5a7b", inputs: 1, outputs: 1 },
  { id: "dicom-import", category: "medical", title: "DICOM Import", description: "وارد کردن تصویر DICOM", icon: "download", color: "#4da8a8", inputs: 1, outputs: 1 },
  { id: "ris-sync", category: "medical", title: "RIS Sync", description: "همگام‌سازی RIS", icon: "refresh-cw", color: "#4a7a96", inputs: 1, outputs: 1 },
  { id: "his-sync", category: "medical", title: "HIS Sync", description: "همگام‌سازی HIS", icon: "building-2", color: "#5aabbf", inputs: 1, outputs: 1 },

  // AI
  { id: "ai-decision", category: "ai", title: "تصمیم AI", description: "تصمیم‌گیری هوشمند", icon: "brain", color: "#10a37f", inputs: 1, outputs: 2 },
  { id: "ai-classification", category: "ai", title: "طبقه‌بندی AI", description: "دسته‌بندی خودکار", icon: "tags", color: "#5b5fc7", inputs: 1, outputs: 1 },
  { id: "ai-ocr", category: "ai", title: "AI OCR", description: "استخراج متن از سند", icon: "scan-text", color: "#2d5a7b", inputs: 1, outputs: 1 },
  { id: "ai-summary", category: "ai", title: "خلاصه AI", description: "خلاصه‌سازی گزارش", icon: "file-text", color: "#4da8a8", inputs: 1, outputs: 1 },
  { id: "ai-chat", category: "ai", title: "AI Chat", description: "گفتگو با THE MACHINE", icon: "message-square", color: "#10a37f", inputs: 1, outputs: 1 },
  { id: "ai-routing", category: "ai", title: "مسیریابی AI", description: "مسیریابی هوشمند", icon: "git-branch", color: "#5b5fc7", inputs: 1, outputs: 3 },
  { id: "ai-workflow-suggestion", category: "ai", title: "پیشنهاد Workflow", description: "پیشنهاد گردش‌کار", icon: "sparkles", color: "#5b5fc7", inputs: 0, outputs: 1 },
  { id: "ai-prediction", category: "ai", title: "پیش‌بینی AI", description: "پیش‌بینی روند", icon: "trending-up", color: "#4da8a8", inputs: 1, outputs: 1 },
  { id: "ai-medical-insight", category: "ai", title: "بینش پزشکی", description: "تحلیل بالینی AI", icon: "activity", color: "#2d5a7b", inputs: 1, outputs: 1 },
  { id: "voice-recognition", category: "ai", title: "تشخیص صدا", description: "تبدیل گفتار به متن", icon: "mic", color: "#c4a574", inputs: 1, outputs: 1 },

  // Communication
  { id: "sms", category: "communication", title: "پیامک", description: "ارسال SMS", icon: "smartphone", color: "#5b5fc7", inputs: 1, outputs: 1 },
  { id: "whatsapp", category: "communication", title: "واتساپ", description: "ارسال WhatsApp", icon: "message-circle", color: "#25D366", inputs: 1, outputs: 1 },
  { id: "telegram", category: "communication", title: "تلگرام", description: "ارسال Telegram", icon: "send", color: "#0088cc", inputs: 1, outputs: 1 },
  { id: "email", category: "communication", title: "ایمیل", description: "ارسال Email", icon: "mail", color: "#b8943a", inputs: 1, outputs: 1 },
  { id: "notification", category: "communication", title: "اعلان", description: "اعلان داخلی", icon: "bell", color: "#5aabbf", inputs: 1, outputs: 1 },
  { id: "phone-call", category: "communication", title: "تماس تلفنی", description: "برقراری تماس", icon: "phone", color: "#4d8a5c", inputs: 1, outputs: 1 },
  { id: "calendar", category: "communication", title: "تقویم", description: "رویداد تقویم", icon: "calendar", color: "#4285F4", inputs: 1, outputs: 1 },

  // Documents
  { id: "pdf-generate", category: "documents", title: "تولید PDF", description: "ساخت فایل PDF", icon: "file-type", color: "#b86b6b", inputs: 1, outputs: 1 },
  { id: "archive-doc", category: "documents", title: "آرشیو سند", description: "ذخیره در آرشیو", icon: "archive", color: "#7b8a9a", inputs: 1, outputs: 1 },

  // Automation
  { id: "delay", category: "automation", title: "تأخیر", description: "مکث زمانی", icon: "timer", color: "#8b919a", inputs: 1, outputs: 1 },
  { id: "condition", category: "automation", title: "شرط", description: "بررسی شرط", icon: "git-merge", color: "#5b5fc7", inputs: 1, outputs: 2 },
  { id: "loop", category: "automation", title: "حلقه", description: "تکرار عملیات", icon: "repeat", color: "#4a7a96", inputs: 1, outputs: 1 },

  // Financial
  { id: "create-invoice", category: "financial", title: "صدور فاکتور", description: "ایجاد فاکتور", icon: "calculator", color: "#2d5a7b", inputs: 1, outputs: 1 },
  { id: "insurance-check", category: "financial", title: "بررسی بیمه", description: "استعلام پوشش", icon: "shield", color: "#4da8a8", inputs: 1, outputs: 1 },
  { id: "payment-received", category: "financial", title: "دریافت پرداخت", description: "پرداخت ثبت شد", icon: "banknote", color: "#4d8a5c", inputs: 1, outputs: 1 },
  { id: "refund", category: "financial", title: "استرداد", description: "بازپرداخت", icon: "undo", color: "#b8943a", inputs: 1, outputs: 1 },
  { id: "accounting", category: "financial", title: "حسابداری", description: "ثبت سند مالی", icon: "landmark", color: "#2d5a7b", inputs: 1, outputs: 1 },

  // Patient
  { id: "patient-lookup", category: "patient", title: "جستجوی بیمار", description: "یافتن پرونده", icon: "search", color: "#4da8a8", inputs: 1, outputs: 1 },
  { id: "patient-notify", category: "patient", title: "اطلاع بیمار", description: "اطلاع‌رسانی", icon: "user", color: "#5b5fc7", inputs: 1, outputs: 1 },

  // Scheduling
  { id: "schedule-trigger", category: "scheduling", title: "زمان‌بندی", description: "اجرای زمان‌بندی‌شده", icon: "clock", color: "#5aabbf", inputs: 0, outputs: 1 },
  { id: "book-appointment", category: "scheduling", title: "رزرو نوبت", description: "ثبت نوبت جدید", icon: "calendar-plus", color: "#4285F4", inputs: 1, outputs: 1 },

  // Analytics
  { id: "generate-report", category: "analytics", title: "تولید گزارش", description: "گزارش تحلیلی", icon: "bar-chart", color: "#2d5a7b", inputs: 1, outputs: 1 },
  { id: "metrics", category: "analytics", title: "متریک", description: "ثبت شاخص", icon: "gauge", color: "#4da8a8", inputs: 1, outputs: 1 },

  // Security
  { id: "audit-log", category: "security", title: "لاگ امنیتی", description: "ثبت رویداد", icon: "shield", color: "#7b8a9a", inputs: 1, outputs: 1 },
  { id: "access-check", category: "security", title: "بررسی دسترسی", description: "کنترل مجوز", icon: "lock", color: "#2d5a7b", inputs: 1, outputs: 2 },
];

export function getNodeDef(id: string): NodeDefinition | undefined {
  return nodeDefinitions.find((n) => n.id === id);
}
