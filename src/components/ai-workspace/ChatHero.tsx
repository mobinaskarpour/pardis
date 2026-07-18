"use client";

import { motion } from "framer-motion";
import { LivingCore } from "@/components/command-center/LivingCore";
import { chatGreeting } from "@/mock/data/chat-experience";
import { spring } from "@/lib/motion";

export function ChatHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="flex flex-col items-center text-center px-4 pt-6 pb-2"
    >
      <LivingCore size="sm" variant="ambient" />

      <p className="mt-8 text-[14px] font-medium text-text-muted">
        {chatGreeting.timeLabel}{" "}
        <span className="text-text-primary">{chatGreeting.userName}</span>
      </p>
      <p className="mt-1 text-[12px] font-medium text-text-tertiary">
        {chatGreeting.userRole}
      </p>

      <h1 className="mt-3 max-w-lg text-[22px] md:text-[24px] font-semibold leading-snug tracking-tight text-text-primary">
        {chatGreeting.headline}
      </h1>

      <p className="mt-2.5 text-[13px] text-text-tertiary max-w-md leading-relaxed">
        THEMACHINE سیستم‌عامل مرکز است — نه یک چت‌بات ساده.
      </p>
    </motion.div>
  );
}
