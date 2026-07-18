export type VoiceAssistantState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";

export interface VoiceDemoTurn {
  transcript: string;
  responsePreview: string;
}

/** Demo voice prompts — realistic CEO queries for Pardis Noor */
export const voiceDemoTurns: VoiceDemoTurn[] = [
  {
    transcript: "امروز وضعیت MRI را بررسی کن.",
    responsePreview:
      "خلاصه برای مدیرعامل: امروز ۱۶ اسکن MRI انجام شده، ۳ گزارش آماده تأیید و دستگاه ۲ با بیشترین بار در حال کار است.",
  },
  {
    transcript: "کدام گزارش‌ها نیاز به بررسی فوری دارند؟",
    responsePreview:
      "سه گزارش فوری شناسایی شد. پرونده ۲۱۴ — MRI مغز — در صدر اولویت قرار دارد.",
  },
  {
    transcript: "خلاصه عملکرد امروز مرکز را بگو.",
    responsePreview:
      "خلاصه عملکرد امروز مرکز برای مدیرعامل آماده است: ۴۷ بیمار، ۲۴ گزارش آماده، درآمد ۴۸٫۲ میلیون تومان.",
  },
];

export const VOICE_STATE_LABELS: Record<VoiceAssistantState, string> = {
  idle: "در حال گوش دادن...",
  listening: "در حال گوش دادن...",
  thinking: "در حال تحلیل...",
  speaking: "ماشین در حال پاسخ است...",
};
