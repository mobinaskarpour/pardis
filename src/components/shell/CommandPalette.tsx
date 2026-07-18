"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Clock } from "lucide-react";
import { commandPalette, spring, stagger } from "@/lib/motion";
import { commandPaletteItems } from "@/mock/data/command-center";
import { uiLabels } from "@/config/labels";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const recentItems = commandPaletteItems.slice(0, 3);

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = commandPaletteItems.filter(
    (item) =>
      item.title.includes(query) ||
      item.subtitle.includes(query) ||
      item.category.includes(query)
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.01 } : { duration: 0.18 }}
            className="fixed inset-0 z-50 bg-text-primary/20 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={commandPalette}
            role="dialog"
            aria-modal="true"
            aria-label="جستجوی سراسری"
            className="fixed top-[14%] start-1/2 z-50 w-[min(100%-2rem,32rem)] -translate-x-1/2 overflow-hidden"
          >
            <div className="rounded-[16px] border border-border bg-bg-elevated shadow-[var(--shadow-lg)] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search size={16} strokeWidth={1.75} className="text-text-tertiary shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="بیمار، پزشک، MRI، گزارش، دستور…"
                  className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-[7px] text-text-tertiary hover:bg-bg-subtle hover:text-text-secondary cursor-pointer"
                  aria-label="بستن"
                >
                  <X size={14} strokeWidth={1.75} />
                </button>
              </div>

              {!query && (
                <div className="border-b border-border px-2 py-2">
                  <p className="px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-text-muted flex items-center gap-1.5">
                    <Clock size={11} strokeWidth={1.75} /> {uiLabels.recent}
                  </p>
                  {recentItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.04 + i * 0.04, ...spring.gentle }}
                    >
                      <ResultRow item={item} onSelect={onClose} />
                    </motion.div>
                  ))}
                  <p className="px-2.5 py-1.5 mt-1 text-[10px] font-semibold tracking-wide text-text-muted flex items-center gap-1.5">
                    <Sparkles size={11} strokeWidth={1.75} /> پیشنهاد هوشمند
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-right rounded-[10px] px-3 py-2 text-[13px] text-primary hover:bg-primary/5 cursor-pointer"
                  >
                    پرونده احمدی — دستور هوشمند
                  </button>
                </div>
              )}

              <motion.div
                className="max-h-72 overflow-y-auto p-2 scrollbar-none"
                variants={stagger.fast}
                initial="initial"
                animate="animate"
              >
                {filtered.length === 0 ? (
                  <p className="px-3 py-8 text-center text-[13px] text-text-tertiary">
                    نتیجه‌ای یافت نشد
                  </p>
                ) : (
                  filtered.map((item, i) => (
                    <motion.div key={item.id} variants={stagger.item} custom={i}>
                      <ResultRow item={item} onSelect={onClose} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ResultRow({
  item,
  onSelect,
}: {
  item: (typeof commandPaletteItems)[0];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-right",
        "transition-colors duration-[120ms] hover:bg-bg-subtle cursor-pointer"
      )}
    >
      {"imageUrl" in item && item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl as string}
          alt=""
          className="h-8 w-8 shrink-0 rounded-[8px] object-cover"
        />
      ) : (
        <span className="shrink-0 rounded-[6px] bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          {item.category}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-text-primary truncate">{item.title}</p>
        <p className="text-[12px] text-text-tertiary truncate">{item.subtitle}</p>
      </div>
    </button>
  );
}
