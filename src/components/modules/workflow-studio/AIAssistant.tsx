"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { spring } from "@/lib/motion";

interface AIAssistantProps {
  onCommand: (cmd: string) => void;
}

const suggestions = [
  "به این Workflow شرط اضافه کن",
  "این Workflow را سریع‌تر کن",
  "اگر بیمار VIP بود چه اتفاقی بیفتد؟",
];

export function AIAssistant({ onCommand }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "من THEMACHINE هستم. می‌توانم Workflow مرکز را برای مدیرعامل ویرایش، بهینه یا گسترش دهم.",
    },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const cmd = input.trim();
    setMessages((m) => [...m, { role: "user", text: cmd }]);
    setInput("");
    onCommand(cmd);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "✓ تغییرات اعمال شد. گره شرط VIP به شاخه اصلی اضافه شد.",
        },
      ]);
    }, 800);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={spring.panel}
          className="fixed bottom-6 right-6 z-50 w-[300px] rounded-[18px] border border-border/60 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(17,19,24,0.12)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-accent-indigo/5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-indigo" />
              <span className="text-[13px] font-semibold text-text-primary">
                دستیار AI
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[200px] overflow-y-auto p-3 space-y-2 scrollbar-none">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-[12px] px-3 py-2 text-[12px] leading-relaxed ${
                  m.role === "ai"
                    ? "bg-accent-indigo/8 text-text-secondary"
                    : "bg-primary/8 text-text-primary mr-4"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(s);
                }}
                className="rounded-full bg-bg-subtle px-2.5 py-1 text-[10px] text-text-muted hover:text-text-secondary cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2 p-3 border-t border-border/40">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="از THEMACHINE بپرس..."
              className="flex-1 rounded-[12px] border border-border bg-bg-subtle/50 px-3 py-2 text-[12px] focus:outline-none focus:border-primary/30"
            />
            <button
              type="button"
              onClick={send}
              className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-accent-indigo text-white cursor-pointer hover:bg-accent-indigo/90"
            >
              <Send size={14} />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border/60 bg-white/95 backdrop-blur-xl px-4 py-2 shadow-[0_4px_20px_rgba(17,19,24,0.1)] cursor-pointer hover:border-accent-indigo/30 transition-colors"
        >
          <Sparkles size={16} className="text-accent-indigo" />
          <span className="text-[12px] font-medium text-text-primary">
            دستیار AI
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
