"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Sparkles, MessageSquare } from "lucide-react";
import { useWorkflowStore } from "@/store/workflow-store";
import { useLiveDashboard } from "@/hooks/useLiveDashboard";
import { buildHeroDashboardCards, parseMetricId } from "@/lib/analytics-metrics";
import { DynamicWidgetCard } from "./widgets/DynamicWidgetCard";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { workflowStatus } from "@/types/workflow";
import type { DashboardWidgetInstance } from "@/hooks/useLiveDashboard";

interface DynamicDashboardProps {
  onOpenMenu?: () => void;
  onOpenSearch?: () => void;
}

export function DynamicDashboard({ onOpenMenu, onOpenSearch }: DynamicDashboardProps) {
  const workflows = useWorkflowStore((s) => s.workflows);
  const { currentInsight, allWidgets } = useLiveDashboard(workflows);
  const [tab, setTab] = useState<"summary" | "workflows">("summary");

  const heroWidgets = useMemo(() => {
    const cards = buildHeroDashboardCards(workflows);
    return cards
      .map((card) => {
        const parsed = parseMetricId(card.metricId);
        if (!parsed) return null;
        const live = allWidgets.find(
          (w) => w.workflowId === parsed.workflowId && w.id === parsed.widgetId
        );
        return live ?? null;
      })
      .filter(Boolean) as DashboardWidgetInstance[];
  }, [workflows, allWidgets]);

  const allEnabledWidgets = useMemo(
    () =>
      allWidgets.filter(
        (w) => workflows.find((wf) => wf.id === w.workflowId)?.enabled
      ),
    [allWidgets, workflows]
  );

  const pulseStats = useMemo(() => {
    const active = workflows.filter((w) => workflowStatus(w) === "active").length;
    const runsToday = workflows.reduce((s, w) => s + w.runsToday, 0);
    const alerts = workflows.filter((w) => w.issue || w.health !== "ok").length;
    return { active, runsToday, alerts };
  }, [workflows]);

  return (
    <div className="flex h-full flex-col bg-bg-layer-1">
      <header className="relative shrink-0 border-b border-border/70 px-6 py-5 md:px-8">
        <div className="relative flex items-center gap-4">
          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-text-secondary hover:bg-bg-subtle transition-colors"
              aria-label="باز کردن منو"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
          )}

          <div className="shrink-0 min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[20px] font-semibold tracking-tight text-text-primary">
                مرکز فرمان
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                زنده
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-text-tertiary">
              پردیس نور · پلتفرم هوشمند تصویربرداری
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            className={cn(
              "hidden sm:flex flex-1 max-w-lg mx-auto items-center gap-2.5 rounded-[12px]",
              "border border-border bg-bg-elevated px-4 py-2.5 text-[13px] text-text-muted",
              "transition-all hover:border-border-hover hover:shadow-[var(--shadow-sm)]"
            )}
          >
            <Search size={15} strokeWidth={1.75} className="shrink-0 opacity-50" />
            <span className="truncate flex-1 text-right">
              جستجو یا دستور به THEMACHINE…
            </span>
            <kbd className="hidden lg:inline-flex rounded-[5px] border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/chat"
            aria-label="گفتگو با ماشین"
            className={cn(
              "shrink-0 flex h-9 w-9 items-center justify-center rounded-[10px]",
              "bg-primary text-white shadow-[var(--shadow-sm)]",
              "hover:bg-primary-muted transition-colors"
            )}
          >
            <Sparkles size={16} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative inline-flex rounded-[11px] bg-bg-subtle p-1">
            {(
              [
                { id: "summary" as const, label: "خلاصه روزانه" },
                { id: "workflows" as const, label: "همه گردش‌کارها" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative rounded-[9px] px-4 py-1.5 text-[13px] font-medium transition-colors",
                  tab === t.id
                    ? "text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="dashboard-tab"
                    className="absolute inset-0 rounded-[9px] bg-bg-elevated shadow-[var(--shadow-sm)]"
                    transition={spring.soft}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[12px] text-text-muted">
            <span>
              <span className="font-semibold text-text-primary tabular-nums">
                {toPersianDigits(pulseStats.active)}
              </span>{" "}
              فرآیند فعال
            </span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span>
              <span className="font-semibold text-text-primary tabular-nums">
                {toPersianDigits(pulseStats.runsToday)}
              </span>{" "}
              اجرای امروز
            </span>
            {pulseStats.alerts > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-border-strong" />
                <span className="font-medium text-warning">
                  {toPersianDigits(pulseStats.alerts)} هشدار
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 scrollbar-none">
        <div className="mx-auto max-w-[1400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInsight}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={spring.gentle}
              className={cn(
                "mb-6 flex items-start gap-3 rounded-[14px] border border-border p-4",
                "bg-bg-elevated shadow-[var(--shadow-sm)]"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
                <Sparkles size={15} className="text-primary" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-[0.08em] text-text-muted mb-1">
                  بینش هوشمند
                </p>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  {currentInsight.replace(/^[✦⚠]\s*/, "")}
                </p>
              </div>
              <Link
                href="/chat"
                className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border border-border bg-bg-layer-1 px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:border-primary/20 hover:text-primary transition-colors"
              >
                <MessageSquare size={12} strokeWidth={1.75} />
                پرسیدن
              </Link>
            </motion.div>
          </AnimatePresence>

          {tab === "summary" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={spring.soft}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {heroWidgets.map((widget, i) => (
                <DynamicWidgetCard
                  key={widget.workflowId + widget.id}
                  widget={widget}
                  index={i}
                  live
                  featured={i === 0}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={spring.soft}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {allEnabledWidgets.map((widget, i) => (
                <DynamicWidgetCard
                  key={`all-${widget.workflowId}-${widget.id}`}
                  widget={widget}
                  index={i}
                  live
                />
              ))}
              <Link
                href="/workflows"
                className="group flex h-[220px] flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-border bg-bg-elevated/40 text-[13px] font-medium text-text-muted hover:border-primary/25 hover:bg-bg-elevated hover:text-primary transition-all"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-subtle text-text-tertiary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  +
                </span>
                مشاهده همه گردش‌کارها
              </Link>
            </motion.div>
          )}

          {heroWidgets.length === 0 && (
            <div className="rounded-[16px] border border-dashed border-border bg-bg-elevated/50 p-14 text-center">
              <p className="text-[14px] text-text-secondary">
                هنوز گردش‌کاری فعال نیست. از گفتگو با THEMACHINE شروع کنید.
              </p>
              <Link
                href="/chat"
                className="mt-4 inline-flex items-center gap-2 rounded-[11px] bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-sm)]"
              >
                گفتگوی جدید
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
