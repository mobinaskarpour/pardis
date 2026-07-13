"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { chatSuggestions } from "@/mock/data/dashboard";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function DashboardChatBox() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const goToChat = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-[18px] border border-border-hover bg-bg-elevated/80 p-5 shadow-md backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2 text-text-secondary">
          <Sparkles size={16} strokeWidth={1.75} className="text-accent-indigo" />
          <p className="text-[13px] font-medium">
            از هوش مصنوعی مرکز بپرسید — پاسخ در فضای کار AI باز می‌شود
          </p>
        </div>

        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            goToChat(value);
          }}
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="مثلاً: گزارش امروز مرکز را خلاصه کن…"
            className={cn(
              "flex-1 rounded-[10px] border border-border bg-bg px-4 py-2.5",
              "text-[15px] text-text-primary placeholder:text-text-tertiary",
              "outline-none transition-colors duration-[120ms] focus:border-border-hover"
            )}
          />
          <motion.button
            type="submit"
            disabled={!value.trim()}
            whileHover={{ y: -2, transition: spring.gentle }}
            whileTap={{ scale: 0.95, transition: spring.snappy }}
            className={cn(
              "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px]",
              "transition-colors duration-[120ms]",
              value.trim()
                ? "cursor-pointer border border-primary bg-primary text-white"
                : "cursor-not-allowed border border-border text-text-tertiary opacity-50"
            )}
            aria-label="ارسال و رفتن به گفتگو"
          >
            <ArrowUp size={18} strokeWidth={1.75} />
          </motion.button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {chatSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => goToChat(s)}
              className="cursor-pointer rounded-full border border-border bg-bg px-3 py-1.5 text-[12px] text-text-secondary transition-colors duration-[120ms] hover:border-border-hover hover:text-text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
