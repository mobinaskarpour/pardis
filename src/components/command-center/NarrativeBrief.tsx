"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";

const narratives = [
  {
    id: "today",
    label: "امروز",
    story: "۲۴ بیمار مراجعه کرده‌اند.",
    detail: "۸ گزارش نیاز به تأیید دارند.",
    accent: "var(--primary)",
  },
  {
    id: "waiting",
    label: "انتظار",
    story: "میانگین زمان انتظار ۱۲٪ کاهش یافته.",
    detail: "۵ بیمار در صف پذیرش هستند.",
    accent: "var(--accent-turquoise)",
  },
  {
    id: "priority",
    label: "اولویت",
    story: "پرونده ۲۱۴ نیاز به بررسی فوری دارد.",
    detail: "MRI مغز — دکتر رضایی",
    accent: "var(--accent-warm)",
  },
  {
    id: "flow",
    label: "جریان",
    story: "دستگاه MRI شماره ۲ بیشترین بار را دارد.",
    detail: "۱۶ تصویربرداری تا این لحظه",
    accent: "var(--accent-indigo)",
  },
];

interface NarrativeBriefProps {
  compact?: boolean;
}

export function NarrativeBrief({ compact }: NarrativeBriefProps) {
  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className={
        compact
          ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      }
    >
      {narratives.map((item, i) => (
        <motion.article
          key={item.id}
          variants={stagger.item}
          transition={{ ...spring.soft, delay: i * 0.06 }}
          whileHover={{ y: -3, transition: spring.gentle }}
          className="group relative rounded-[var(--radius-xl)] glass-subtle p-5 overflow-hidden cursor-default"
        >
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-[0.12]"
            style={{ background: item.accent }}
          />

          <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider text-text-muted mb-2">
            {item.label}
          </p>
          <p className="text-[var(--text-body-lg)] font-medium text-text-primary leading-snug">
            {item.story}
          </p>
          <p className="mt-2 text-[var(--text-sm)] text-text-tertiary leading-relaxed">
            {item.detail}
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
