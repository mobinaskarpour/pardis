"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  GitBranch,
  LayoutDashboard,
  Pin,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  todayKpis,
  recentWorkflowsContext,
  pinnedConversationsContext,
  suggestedAutomations,
  upcomingTasks,
} from "@/mock/data/chat-experience";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function TodayContextPanel() {
  return (
    <aside className="hidden xl:flex w-[280px] shrink-0 flex-col border-s border-border/60 bg-[#fafbfc] h-full overflow-y-auto scrollbar-none">
      <div className="p-4 border-b border-border/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
          Today&apos;s Context
        </p>
        <p className="text-[14px] font-semibold text-text-primary mt-1">
          زمینه امروز
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* KPIs */}
        <section>
          <p className="text-[11px] font-bold text-text-muted mb-2.5 flex items-center gap-1.5">
            <LayoutDashboard size={12} />
            KPIs امروز
          </p>
          <div className="grid grid-cols-2 gap-2">
            {todayKpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ...spring.soft }}
                className="rounded-[12px] border border-border/50 bg-white p-3"
              >
                <p className="text-[18px] font-bold text-text-primary leading-none">
                  {kpi.value}
                </p>
                <p className="text-[10px] text-text-muted mt-1">{kpi.label}</p>
                {kpi.trend && (
                  <p className="text-[10px] font-semibold text-success mt-0.5">
                    {kpi.trend}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent workflows */}
        <section>
          <p className="text-[11px] font-bold text-text-muted mb-2 flex items-center gap-1.5">
            <GitBranch size={12} />
            گردش‌کارهای اخیر
          </p>
          <ul className="space-y-1">
            {recentWorkflowsContext.map((wf) => (
              <li key={wf.id}>
                <Link
                  href={`/workflows/${wf.id}`}
                  className="flex items-center justify-between rounded-[10px] px-2.5 py-2 text-[12px] hover:bg-white transition-colors"
                >
                  <span className="text-text-secondary truncate">{wf.name}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-[5px] px-1.5 py-px text-[9px] font-bold",
                      wf.status === "هشدار"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                    )}
                  >
                    {wf.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Pinned */}
        <section>
          <p className="text-[11px] font-bold text-text-muted mb-2 flex items-center gap-1.5">
            <Pin size={12} />
            گفتگوهای سنجاق‌شده
          </p>
          <ul className="space-y-1">
            {pinnedConversationsContext.map((c) => (
              <li key={c.id}>
                <Link
                  href="/chat"
                  className="block rounded-[10px] px-2.5 py-2 text-[12px] text-text-secondary hover:bg-white"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Suggested automations */}
        <section>
          <p className="text-[11px] font-bold text-text-muted mb-2 flex items-center gap-1.5">
            <Sparkles size={12} />
            اتوماسیون پیشنهادی
          </p>
          <ul className="space-y-1.5">
            {suggestedAutomations.map((name) => (
              <li
                key={name}
                className="rounded-[10px] border border-accent-indigo/15 bg-accent-indigo/[0.04] px-2.5 py-2 text-[11px] text-text-secondary"
              >
                {name}
              </li>
            ))}
          </ul>
        </section>

        {/* Upcoming tasks */}
        <section>
          <p className="text-[11px] font-bold text-text-muted mb-2 flex items-center gap-1.5">
            <Calendar size={12} />
            کارهای پیش‌رو
          </p>
          <ul className="space-y-1">
            {upcomingTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[12px] text-text-secondary hover:bg-white"
              >
                {task.urgent && (
                  <Zap size={12} className="text-warning shrink-0" />
                )}
                {task.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
