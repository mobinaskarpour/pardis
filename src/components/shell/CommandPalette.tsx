"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Clock } from "lucide-react";
import { commandPalette, spring, stagger } from "@/lib/motion";
import { commandPaletteItems } from "@/mock/data/command-center";
import { uiLabels } from "@/config/labels";
import { useReducedMotion } from "@/components/motion";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const recentItems = commandPaletteItems.slice(0, 3);

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();

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
            transition={reduced ? { duration: 0.01 } : spring.gentle}
            className="fixed inset-0 z-50 bg-text-primary/15 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={commandPalette}
            className="fixed top-[15%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden"
          >
            <div className="rounded-[14px] border border-border bg-bg-elevated/95 backdrop-blur-md shadow-[var(--shadow-md)]">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search size={18} strokeWidth={1.75} className="text-text-tertiary shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="بیمار، پزشک، MRI، گزارش، دستور AI..."
                  className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary outline-none"
                  autoFocus
                />
                <button type="button" onClick={onClose} className="text-text-tertiary hover:text-text-secondary cursor-pointer" aria-label="بستن">
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>

              {!query && (
                <div className="border-b border-border px-2 py-2">
                  <p className="px-2 py-1 text-[11px] font-medium text-text-tertiary flex items-center gap-1">
                    <Clock size={12} /> {uiLabels.recent}
                  </p>
                  {recentItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.05 + i * 0.05, ...spring.gentle }}
                    >
                      <ResultRow item={item} onSelect={onClose} />
                    </motion.div>
                  ))}
                  <p className="px-2 py-1 mt-1 text-[11px] font-medium text-text-tertiary flex items-center gap-1">
                    <Sparkles size={12} /> AI
                  </p>
                  <button type="button" onClick={onClose} className="w-full text-right px-3 py-2 text-[13px] text-primary hover:bg-bg-subtle rounded-[10px] cursor-pointer">
                    پرونده احمدی — دستور AI
                  </button>
                </div>
              )}

              <motion.div
                className="max-h-72 overflow-y-auto p-2"
                variants={stagger.fast}
                initial="initial"
                animate="animate"
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    variants={stagger.item}
                    custom={i}
                  >
                    <ResultRow item={item} onSelect={onClose} />
                  </motion.div>
                ))}
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
      className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-right transition-colors duration-[120ms] hover:bg-bg-subtle cursor-pointer"
    >
      <span className="shrink-0 rounded-[6px] bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
        {item.category}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-text-primary truncate">{item.title}</p>
        <p className="text-[13px] text-text-tertiary truncate">{item.subtitle}</p>
      </div>
    </button>
  );
}
