"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Terminal,
  Gauge,
  AlertCircle,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian";
import type { StudioLog, StudioVersion } from "@/types/workflow-studio";
import { spring } from "@/lib/motion";

interface ExecutionTimelineProps {
  open: boolean;
  onToggle: () => void;
  tab: "logs" | "performance" | "errors" | "history";
  onTabChange: (t: "logs" | "performance" | "errors" | "history") => void;
  logs: StudioLog[];
  versions: StudioVersion[];
  onRestoreVersion: (id: string) => void;
}

const tabs = [
  { id: "logs" as const, label: "لاگ زنده", icon: Terminal },
  { id: "performance" as const, label: "عملکرد", icon: Gauge },
  { id: "errors" as const, label: "خطاها", icon: AlertCircle },
  { id: "history" as const, label: "تاریخچه", icon: History },
];

export function ExecutionTimeline({
  open,
  onToggle,
  tab,
  onTabChange,
  logs,
  versions,
  onRestoreVersion,
}: ExecutionTimelineProps) {
  const errors = logs.filter((l) => l.level === "error");

  return (
    <div
      className={cn(
        "shrink-0 border-t border-border/60 bg-white/95 backdrop-blur-xl transition-[height] duration-[200ms]",
        open ? "h-[180px]" : "h-8"
      )}
    >
      <div className="flex h-9 items-center justify-between px-3 border-b border-border/40">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                "flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                tab === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-[8px] text-text-muted hover:bg-bg-subtle cursor-pointer"
        >
          {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring.gentle}
            className="h-[calc(100%-36px)] overflow-y-auto p-3 scrollbar-none"
          >
            {tab === "logs" && (
              <div className="space-y-1 font-mono text-[11px]" dir="ltr">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      "flex gap-3 px-2 py-1 rounded-[6px]",
                      log.level === "success" && "text-success",
                      log.level === "error" && "text-error",
                      log.level === "warning" && "text-warning",
                      log.level === "info" && "text-text-secondary"
                    )}
                  >
                    <span className="text-text-muted shrink-0">{log.time}</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "performance" && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "میانگین اجرا", value: "۱.۲s" },
                  { label: "گره‌ها", value: toPersianDigits(logs.length) },
                  { label: "موفق", value: "۹۸٪" },
                  { label: "آخرین اجرا", value: "۲ دقیقه پیش" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-[10px] bg-bg-subtle/50 px-3 py-2"
                  >
                    <p className="text-[10px] text-text-muted">{s.label}</p>
                    <p className="text-[16px] font-semibold text-text-primary mt-0.5">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "errors" && (
              <div className="space-y-1">
                {errors.length === 0 ? (
                  <p className="text-[12px] text-text-muted">خطایی ثبت نشده</p>
                ) : (
                  errors.map((e) => (
                    <p key={e.id} className="text-[12px] text-error">
                      {e.time} — {e.message}
                    </p>
                  ))
                )}
              </div>
            )}

            {tab === "history" && (
              <div className="space-y-2">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onRestoreVersion(v.id)}
                    className="flex w-full items-center justify-between rounded-[10px] border border-border/60 px-3 py-2 text-right hover:bg-bg-subtle/60 transition-colors cursor-pointer"
                  >
                    <span className="text-[12px] font-medium text-text-primary">
                      {v.label}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {v.author} · {v.time}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
