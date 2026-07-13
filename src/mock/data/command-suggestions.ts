export type CommandCategory =
  | "clinical"
  | "imaging"
  | "ai"
  | "operations"
  | "financial";

export interface CommandCategoryMeta {
  id: CommandCategory;
  label: string;
  description: string;
}

export interface CommandSuggestion {
  id: string;
  label: string;
  query: string;
  category: CommandCategory;
  specialty?: string;
  urgent?: boolean;
}

export const commandCategories: CommandCategoryMeta[] = [
  { id: "clinical", label: "بالینی", description: "بیماران و پرونده‌ها" },
  { id: "imaging", label: "تصویربرداری", description: "PACS و modality" },
  { id: "ai", label: "هوش مصنوعی", description: "تحلیل و تصمیم‌یار" },
  { id: "operations", label: "عملیات", description: "Workflow و دستگاه‌ها" },
  { id: "financial", label: "مالی", description: "درآمد و بیمه" },
];

export const defaultCommandSuggestions: CommandSuggestion[] = [
  // بالینی
  {
    id: "patients-today",
    label: "بیماران امروز",
    query: "بیماران امروز",
    category: "clinical",
  },
  {
    id: "patient-ahmadi",
    label: "پرونده احمدی",
    query: "پرونده بیمار احمدی را باز کن",
    category: "clinical",
    specialty: "نورولوژی",
  },
  {
    id: "waiting-queue",
    label: "صف انتظار",
    query: "لیست بیماران در انتظار تأیید پزشک",
    category: "clinical",
  },
  {
    id: "follow-up",
    label: "پیگیری‌های معوق",
    query: "بیمارانی که پیگیری معوق دارند",
    category: "clinical",
    specialty: "پیگیری",
  },

  // تصویربرداری
  {
    id: "mri-ready",
    label: "MRIهای آماده",
    query: "MRIهای آماده بررسی",
    category: "imaging",
    urgent: true,
  },
  {
    id: "pacs-queue",
    label: "صف PACS",
    query: "وضعیت صف PACS و دستگاه‌ها",
    category: "imaging",
    specialty: "PACS",
  },
  {
    id: "compare-mri",
    label: "مقایسه MRI",
    query: "مقایسه MRI پرونده ۲۱۴ با تصویر قبلی",
    category: "imaging",
    specialty: "رادیولوژی",
  },
  {
    id: "urgent-scans",
    label: "اسکن‌های فوری",
    query: "تصویربرداری‌های با اولویت فوری",
    category: "imaging",
    urgent: true,
  },

  // هوش مصنوعی
  {
    id: "ai-lesion",
    label: "تحلیل ضایعه هیپوکامپ",
    query: "تحلیل AI ضایعه هیپوکامپ پرونده ۲۱۴",
    category: "ai",
    specialty: "Deep Learning",
    urgent: true,
  },
  {
    id: "ai-report",
    label: "تولید گزارش خودکار",
    query: "ساخت گزارش رادیولوژی خودکار برای MRI مغز",
    category: "ai",
    specialty: "NLP",
  },
  {
    id: "ai-anomaly",
    label: "کشف آنومالی",
    query: "کشف آنومالی در تصاویر امروز",
    category: "ai",
    specialty: "Computer Vision",
  },
  {
    id: "ai-cdss",
    label: "تصمیم‌یار بالینی",
    query: "پیشنهاد CDSS برای پرونده ۲۱۴",
    category: "ai",
    specialty: "CDSS",
  },
  {
    id: "ai-birads",
    label: "طبقه‌بندی BI-RADS",
    query: "طبقه‌بندی BI-RADS ماموگرافی امروز",
    category: "ai",
    specialty: "ماموگرافی",
  },

  // عملیات
  {
    id: "workflow-mri",
    label: "Workflow پیگیری MRI",
    query: "ساخت Workflow پیگیری MRI",
    category: "operations",
  },
  {
    id: "device-load",
    label: "بار دستگاه‌ها",
    query: "پیش‌بینی بار کاری دستگاه‌های MRI امروز",
    category: "operations",
    specialty: "Scheduling",
  },
  {
    id: "open-reports",
    label: "گزارش‌های باز",
    query: "پرونده‌های باز و گزارش‌های معوق",
    category: "operations",
  },
  {
    id: "sms-reminder",
    label: "یادآوری نوبت",
    query: "ارسال یادآوری نوبت فردا به بیماران",
    category: "operations",
  },

  // مالی
  {
    id: "revenue-month",
    label: "درآمد این ماه",
    query: "درآمد این ماه را نشان بده",
    category: "financial",
  },
  {
    id: "insurance-pending",
    label: "تأییدیه‌های بیمه",
    query: "پرونده‌های در انتظار تأیید بیمه",
    category: "financial",
    specialty: "بیمه",
  },
];

export function getSuggestionsByCategory(
  category: CommandCategory
): CommandSuggestion[] {
  return defaultCommandSuggestions.filter((s) => s.category === category);
}

export function getSuggestionQueries(): string[] {
  return defaultCommandSuggestions.map((s) => s.query);
}

export function findSuggestionByQuery(query: string): CommandSuggestion | undefined {
  const normalized = query.trim();
  return defaultCommandSuggestions.find(
    (s) => s.query === normalized || s.label === normalized
  );
}

/** Map AI follow-up strings to structured suggestions */
export function queriesToSuggestions(queries: string[]): CommandSuggestion[] {
  return queries.map((q, i) => {
    const found = defaultCommandSuggestions.find(
      (s) =>
        s.query === q ||
        s.label === q ||
        q.includes(s.label) ||
        s.query.includes(q)
    );
    if (found) return found;
    return {
      id: `followup-${i}`,
      label: q,
      query: q,
      category: "ai" as const,
    };
  });
}

/** Mock responses for specialized commands */
export const specializedCommandResults: Record<
  string,
  { preview: string; detail: string }
> = {
  "ai-lesion": {
    preview: "ضایعه ۸mm در هیپوکامپ راست — confidence ۸۷٪",
    detail:
      "مدل Deep Learning سه لایه T2/FLAIR/DWI را تحلیل کرد. ضایعه بدون enhancement. پیشنهاد: مقایسه با MRI ۱۴۰۳/۱۱/۱۵.",
  },
  "ai-report": {
    preview: "گزارش رادیولوژی NLP آماده است",
    detail:
      "شامل: Technique، Findings، Impression. یافته اصلی: T2 hyperintensity هیپوکامپ راست ۸mm. آماده ویرایش توسط دکتر رضایی.",
  },
  "ai-anomaly": {
    preview: "۲ آنومالی در ۱۶ اسکن امروز شناسایی شد",
    detail:
      "پرونده ۲۱۴ — hyperintensity temporal. پرونده ۲۰۳ — signal meniscus. هر دو نیاز به تأیید رادیولوژیست.",
  },
  "ai-cdss": {
    preview: "CDSS: ارجاع فوری نورولوژی توصیه می‌شود",
    detail:
      "بر اساس یافته MRI مغز، سابقه میگرن و سن بیمار — احتمال مسیر MS پایین. پیگیری ۳ ماهه کافی است.",
  },
  "ai-birads": {
    preview: "۳ ماموگرافی — همه BI-RADS 1-2",
    detail: "فاطمه رضایی: BI-RADS 1. لیلا فرهادی: BI-RADS 2. بدون نیاز به biopsy.",
  },
  "compare-mri": {
    preview: "Overlay آماده — بدون پیشرفت قابل توجه",
    detail:
      "مقایسه ۱۴۰۴/۰۱/۲۲ با ۱۴۰۳/۱۱/۱۵: اندازه ضایعه ثابت. FLAIR signal بدون تغییر معنادار.",
  },
  "pacs-queue": {
    preview: "MRI-2: ۵ در صف · MRI-1: ۳ در صف · CT: ۲ در صف",
    detail: "زمان انتظار میانگین: ۴۷ دقیقه. دستگاه ۲ بحرانی — ۹۱٪ utilization.",
  },
  "device-load": {
    preview: "پیش‌بینی: MRI-2 تا ساعت ۱۸ پر می‌شود",
    detail: "۱۲ اسکن باقی‌مانده. پیشنهاد: ۳ مورد به دستگاه ۱ منتقل شود.",
  },
  "waiting-queue": {
    preview: "۵ بیمار در انتظار · ۸ منتظر تأیید پزشک",
    detail: "طولانی‌ترین انتظار: علی محمدی — CT شکم — ۱۲۵ دقیقه.",
  },
  "follow-up": {
    preview: "۴ بیمار پیگیری معوق دارند",
    detail: "حسین نوری — MRI ستون فقرات. رضا موسوی — ارتوپد. اولویت با پرونده ۱۴۲.",
  },
  "urgent-scans": {
    preview: "۳ اسکن فوری — پرونده ۲۱۴ در صدر",
    detail: "MRI مغز احمدی · MRI زانو موسوی · CT شکم محمدی (تأیید معوق).",
  },
  "insurance-pending": {
    preview: "۶ پرونده در انتظار تأیید بیمه",
    detail: "مجموع ۴۲M تومان معوق. تأمین اجتماعی: ۴ مورد. نیروهای مسلح: ۲ مورد.",
  },
  "sms-reminder": {
    preview: "۱۸ پیامک آماده ارسال",
    detail: "نوبت فردا — ۱۰:۳۰ تا ۱۶:۰۰. الگوی پیام تأیید شده. ارسال ساعت ۱۸ امشب.",
  },
};
