import type { AIResponse, CanvasType, HistoryCategory } from "./ai-workspace-data";
import {
  findSuggestionByQuery,
  specializedCommandResults,
  defaultCommandSuggestions,
} from "@/mock/data/command-suggestions";

function matchInput(input: string, patterns: string[]): boolean {
  const normalized = input.trim().toLowerCase();
  return patterns.some((p) => normalized.includes(p));
}

function specializedResponse(
  suggestionId: string,
  base: Partial<Omit<AIResponse, "content">> & { content?: string }
): AIResponse | null {
  const mock = specializedCommandResults[suggestionId];
  if (!mock) return null;
  return {
    content: base.content ?? `${mock.preview}\n\n${mock.detail}`,
    canvas: base.canvas ?? "welcome",
    conversationTitle: base.conversationTitle ?? mock.preview,
    category: base.category ?? "sessions",
    reasoning: base.reasoning ?? ["تحلیل تخصصی AI", "پایگاه داده پزشکی"],
    citations: base.citations ?? [
      { id: "cs1", source: "ai", label: "THE MACHINE AI Engine" },
    ],
    suggestedQuestions: base.suggestedQuestions ?? [
      "تحلیل عمیق‌تر",
      "مقایسه با موارد مشابه",
      "ساخت گزارش",
    ],
    actions: base.actions ?? [
      { id: "report", label: "ساخت گزارش" },
      { id: "save", label: "ذخیره تحلیل" },
    ],
  };
}

function trySpecialized(query: string): AIResponse | null {
  const suggestion = findSuggestionByQuery(query);
  if (!suggestion) {
    const byPartial = defaultCommandSuggestions.find(
      (s) =>
        query.includes(s.label) ||
        s.label.includes(query) ||
        query.includes(s.query.slice(0, 12))
    );
    if (byPartial && specializedCommandResults[byPartial.id]) {
      return specializedResponse(byPartial.id, {
        canvas: mapCategoryToCanvas(byPartial.category, byPartial.id),
        conversationTitle: byPartial.label,
        category: mapCategoryToHistory(byPartial.category),
      });
    }
    return null;
  }
  if (!specializedCommandResults[suggestion.id]) return null;
  return specializedResponse(suggestion.id, {
    canvas: mapCategoryToCanvas(suggestion.category, suggestion.id),
    conversationTitle: suggestion.label,
    category: mapCategoryToHistory(suggestion.category),
  });
}

function mapCategoryToCanvas(
  category: string,
  id: string
): CanvasType {
  if (id.includes("mri") || id.includes("scan") || id.includes("pacs") || id.includes("urgent"))
    return "mri-ready";
  if (id.includes("patient") || id.includes("ahmadi") || id.includes("waiting") || id.includes("follow"))
    return "patients-today";
  if (id.includes("revenue") || id.includes("insurance") || id.includes("financial"))
    return "revenue";
  if (id.includes("workflow") || id.includes("device") || id.includes("sms"))
    return "workflow";
  if (id.includes("report") || id.includes("open"))
    return "report";
  if (id.includes("ai-lesion") || id.includes("compare") || id.includes("cdss"))
    return "patient";
  if (category === "ai") return "patient";
  if (category === "clinical") return "patients-today";
  if (category === "imaging") return "mri-ready";
  if (category === "financial") return "revenue";
  if (category === "operations") return "workflow";
  return "welcome";
}

function mapCategoryToHistory(category: string): HistoryCategory {
  const map: Record<string, HistoryCategory> = {
    clinical: "patients",
    imaging: "reports",
    ai: "reports",
    operations: "workflow",
    financial: "financial",
  };
  return map[category] ?? "sessions";
}

export function processAIQuery(input: string): AIResponse {
  const query = input.trim();

  const specialized = trySpecialized(query);
  if (specialized) return specialized;

  if (matchInput(query, ["دوز", "فیزیک بهداشت"])) {
    return {
      content:
        "گزارش دوز امروز بخش سی‌تی تهیه شد: ۲۸ اسکن، دوز میانگین ۸.۴ mSv، بدون مورد خارج از محدوده — و برای واحد فیزیک بهداشت ارسال شد.",
      canvas: "report",
      conversationTitle: "گزارش دوز CT",
      category: "reports",
      reasoning: [
        "استخراج دوز از کنسول دستگاه‌ها",
        "مقایسه با سطوح مرجع تشخیصی",
        "ارسال به فیزیک بهداشت",
      ],
      citations: [
        { id: "cd1", source: "ct", label: "کنسول CT — دستگاه ۱ و ۲" },
        { id: "cd2", source: "report", label: "سطوح مرجع تشخیصی (DRL)" },
      ],
      suggestedQuestions: [
        "موارد دوز بالا این هفته",
        "مقایسه دوز دو دستگاه",
        "گزارش دوز هفتگی",
      ],
      actions: [
        { id: "pdf", label: "تبدیل به PDF" },
        { id: "share", label: "اشتراک‌گذاری" },
      ],
    };
  }

  if (
    matchInput(query, [
      "احمدی",
      "پرونده",
      "بیمار احمد",
      "پرونده بیمار",
      "باز کن",
    ])
  ) {
    return {
      content:
        "پرونده محمد احمدی را باز کردم. سه MRI ثبت شده و یک گزارش نیاز به بررسی فوری دارد.",
      canvas: "patient",
      conversationTitle: "پرونده احمدی",
      category: "patients",
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
        { id: "summarize", label: "خلاصه‌سازی" },
      ],
    };
  }

  if (
    matchInput(query, [
      "درآمد",
      "مالی",
      "فروش",
      "revenue",
      "این ماه",
    ])
  ) {
    return {
      content:
        "درآمد ماه جاری ۱.۲ میلیارد تومان است. نسبت به ماه گذشته ۸٪ کاهش داشته. MRI بیشترین سهم را دارد.",
      canvas: "revenue",
      conversationTitle: "درآمد ماهانه",
      category: "financial",
      reasoning: ["اطلاعات از سیستم مالی", "گزارش روزانه", "تحلیل دستگاه‌ها"],
      citations: [
        { id: "c4", source: "financial", label: "سیستم مالی" },
        { id: "c5", source: "report", label: "گزارش ماهانه" },
      ],
      suggestedQuestions: [
        "مقایسه با ماه گذشته",
        "پرکاربردترین دستگاه",
        "پیش‌بینی ماه آینده",
        "جزئیات MRI",
      ],
      actions: [
        { id: "report", label: "ساخت گزارش" },
        { id: "pdf", label: "تبدیل به PDF" },
        { id: "share", label: "اشتراک‌گذاری" },
      ],
    };
  }

  if (
    matchInput(query, [
      "بیماران امروز",
      "مراجعه",
      "امروز چه بیمار",
      "بیماران",
    ])
  ) {
    return {
      content:
        "امروز ۲۴ بیمار پذیرش شده‌اند. ۵ نفر در انتظار و ۸ نفر منتظر تأیید پزشک هستند.",
      canvas: "patients-today",
      conversationTitle: "بیماران امروز",
      category: "patients",
      reasoning: ["سیستم پذیرش", "تقویم نوبت‌ها", "وضعیت پزشکان"],
      citations: [
        { id: "c7", source: "reception", label: "سیستم پذیرش" },
        { id: "c8", source: "calendar", label: "تقویم امروز" },
      ],
      suggestedQuestions: [
        "بیماران در انتظار",
        "زمان‌بندی فردا",
        "پزشکان فعال",
      ],
      actions: [
        { id: "register", label: "ثبت بیمار" },
        { id: "report", label: "گزارش روزانه" },
      ],
    };
  }

  if (
    matchInput(query, [
      "mri",
      "ام آر آی",
      "تصویر",
      "mriهای آماده",
      "آخرین mri",
    ])
  ) {
    return {
      content:
        "۳ MRI آماده بررسی هستند. پرونده ۲۱۴ — MRI مغز — اولویت فوری.",
      canvas: "mri-ready",
      conversationTitle: "MRIهای آماده",
      category: "reports",
      reasoning: ["سیستم PACS", "گزارش‌های در انتظار", "اولویت‌بندی AI"],
      citations: [
        { id: "c9", source: "pacs", label: "سیستم PACS" },
        { id: "c10", source: "report", label: "گزارش‌های باز" },
      ],
      suggestedQuestions: [
        "پرونده ۲۱۴",
        "دستگاه ۲",
        "گزارش‌های فوری",
      ],
      actions: [
        { id: "workflow", label: "ثبت Workflow" },
        { id: "report", label: "ساخت گزارش" },
      ],
    };
  }

  if (matchInput(query, ["workflow", "اتوماسیون", "ساخت workflow"])) {
    return {
      content:
        "Workflow پیگیری MRI آماده است. شامل ۴ مرحله: ثبت → بررسی → تأیید → اطلاع‌رسانی.",
      canvas: "workflow",
      conversationTitle: "Workflow پیگیری MRI",
      category: "workflow",
      reasoning: ["الگوهای Workflow", "پرونده‌های MRI باز"],
      citations: [
        { id: "c11", source: "workflow", label: "الگوی پیگیری MRI" },
      ],
      suggestedQuestions: [
        "فعال‌سازی Workflow",
        "ویرایش مراحل",
        "تست Workflow",
      ],
      actions: [
        { id: "activate", label: "فعال‌سازی" },
        { id: "edit", label: "ویرایش" },
        { id: "save", label: "ذخیره" },
      ],
    };
  }

  if (matchInput(query, ["گزارش", "report", "پرونده‌های باز"])) {
    return {
      content:
        "۷ پرونده باز وجود دارد. ۳ گزارش نیاز به بررسی فوری دارند.",
      canvas: "report",
      conversationTitle: "گزارش‌ها",
      category: "reports",
      reasoning: ["سیستم گزارش‌ها", "اولویت‌بندی"],
      citations: [
        { id: "c12", source: "reports", label: "سیستم گزارش‌ها" },
      ],
      suggestedQuestions: [
        "گزارش‌های فوری",
        "گزارش ماهانه",
        "پرونده ۲۱۴",
      ],
      actions: [
        { id: "report", label: "ساخت گزارش" },
        { id: "pdf", label: "تبدیل به PDF" },
      ],
    };
  }

  return {
    content:
      "درخواست شما را دریافت کردم. می‌توانید پرونده بیمار، درآمد، MRIها یا Workflow را بررسی کنید.",
    canvas: "welcome",
    conversationTitle: query.slice(0, 30),
    category: "sessions",
    reasoning: ["تحلیل درخواست", "جستجو در پایگاه دانش"],
    citations: [{ id: "c0", source: "knowledge", label: "پایگاه دانش" }],
    suggestedQuestions: defaultCommandSuggestions
      .filter((s) => s.category === "ai" || s.category === "imaging")
      .slice(0, 6)
      .map((s) => s.query),
    actions: [{ id: "save", label: "ذخیره" }],
  };
}

export function getCanvasForQuery(input: string): CanvasType {
  return processAIQuery(input).canvas;
}

export function getCategoryLabel(category: HistoryCategory): string {
  const labels: Record<HistoryCategory, string> = {
    patients: "بیماران",
    reports: "گزارش‌ها",
    financial: "مالی",
    workflow: "Workflow",
    sessions: "جلسات",
  };
  return labels[category];
}
