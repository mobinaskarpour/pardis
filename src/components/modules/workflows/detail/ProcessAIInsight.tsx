"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { spring } from "@/lib/motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProcessAIInsightProps {
  whyCreated?: string;
  optimizations: { id: string; suggestion: string; impact: string }[];
  source: "ai" | "manual";
}

export function ProcessAIInsight({
  whyCreated,
  optimizations,
  source,
}: ProcessAIInsightProps) {
  const headline =
    source === "ai" && whyCreated
      ? whyCreated
      : "این فرآیند به‌صورت دستی تعریف شده — THEMACHINE می‌تواند بهینه‌سازی پیشنهاد دهد.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="relative overflow-hidden rounded-[28px] bg-[#0d1117] p-8 md:p-10"
    >
      <div
        className="absolute -bottom-32 -start-32 h-72 w-72 rounded-full bg-accent-indigo/15 blur-[100px]"
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={15} className="text-accent-cyan" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
            Process Intelligence
          </span>
        </div>
        <p className="text-[19px] md:text-[22px] font-medium leading-[1.5] text-white/90 max-w-2xl">
          {headline}
        </p>
        {optimizations.length > 0 && (
          <ul className="mt-8 space-y-3 border-t border-white/8 pt-6">
            {optimizations.slice(0, 3).map((opt) => (
              <li
                key={opt.id}
                className="flex items-start gap-3 text-[14px] text-white/65 leading-relaxed"
              >
                <span
                  className={
                    opt.impact === "high"
                      ? "text-accent-cyan"
                      : opt.impact === "medium"
                        ? "text-warning"
                        : "text-white/40"
                  }
                >
                  ●
                </span>
                {opt.suggestion}
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/chat"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white/75 hover:bg-white/10 transition-colors"
        >
          گفتگو درباره این فرآیند
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
