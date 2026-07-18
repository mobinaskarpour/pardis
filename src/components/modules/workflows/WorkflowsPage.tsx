"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  ChevronLeft,
  GitBranch,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/core";
import { ModuleHero } from "@/components/modules/shared/ModuleShell";
import { WorkflowCard } from "./WorkflowCard";
import { workflowCategories } from "@/config/workflow-categories";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/store/workflow-store";
import { workflowStatus, type WorkflowCategoryId } from "@/types/workflow";
import { pageLabels } from "@/config/labels";

const lifecycle = [
  "گفتگو",
  "درخواست‌های تکراری",
  "شناسایی الگو",
  "پیشنهاد AI",
  "تأیید مدیر",
  "ساخت گردش‌کار",
  "اجرا",
  "تحلیل و داشبورد",
];

export function WorkflowsPage() {
  const workflows = useWorkflowStore((s) => s.workflows);
  const [category, setCategory] = useState<WorkflowCategoryId | "all">("all");

  const filtered = useMemo(
    () =>
      category === "all"
        ? workflows
        : workflows.filter((w) => w.category === category),
    [workflows, category]
  );

  const aiCount = workflows.filter((w) => w.source === "ai").length;
  const activeCount = workflows.filter((w) => workflowStatus(w) === "active").length;

  return (
    <AppShell pageTitle={pageLabels.workflows}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
        <ModuleHero
          title={pageLabels.workflows}
          subtitle="مرکز تصویربرداری پردیس نور"
          aiSummary="THEMACHINE از گفتگو یاد می‌گیرد و فرآیندهای تکراری را به گردش‌کار تبدیل می‌کند. تحلیل و KPIs در مرکز فرمان — جدا از تعریف فرآیند."
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, ...spring.soft }}
          className="mb-8"
        >
          <Card variant="default" hover={false} padding="md">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              چرخه یادگیری THEMACHINE
            </p>
            <div className="flex min-w-max items-center gap-1 overflow-x-auto scrollbar-none">
              {lifecycle.map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap",
                      i === 0 || i === 2 || i === 5
                        ? "bg-accent-indigo/10 text-accent-indigo"
                        : "bg-bg-subtle/80 text-text-tertiary"
                    )}
                  >
                    {step}
                  </span>
                  {i < lifecycle.length - 1 && (
                    <ChevronLeft size={12} className="text-text-muted rotate-180" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "گردش‌کار فعال", value: activeCount, icon: GitBranch },
            { label: "ساخته‌شده با AI", value: aiCount, icon: Sparkles },
            {
              label: "میانگین Automation Score",
              value: Math.round(
                workflows.reduce((s, w) => s + w.automationScore, 0) /
                  workflows.length
              ),
              icon: TrendingUp,
            },
            {
              label: "اجرای امروز",
              value: workflows.reduce((s, w) => s + w.runsToday, 0),
              icon: Bot,
            },
          ].map((stat) => (
            <Card key={stat.label} variant="status" hover={false} padding="sm">
              <stat.icon
                size={16}
                strokeWidth={1.75}
                className="mb-2 text-text-tertiary"
              />
              <p className="text-[20px] font-bold text-text-primary tabular-nums">
                {toPersianDigits(stat.value)}
              </p>
              <p className="text-[11px] text-text-tertiary">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                category === "all"
                  ? "bg-primary text-white"
                  : "bg-bg-subtle/80 text-text-secondary hover:bg-bg-subtle"
              )}
            >
              همه ({toPersianDigits(workflows.length)})
            </button>
            {workflowCategories.map((cat) => {
              const count = workflows.filter((w) => w.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                    category === cat.id
                      ? "bg-primary text-white"
                      : "bg-bg-subtle/80 text-text-secondary hover:bg-bg-subtle"
                  )}
                >
                  {cat.emoji} {cat.label} ({toPersianDigits(count)})
                </button>
              );
            })}
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-[14px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(45,90,123,0.25)] transition-transform hover:scale-[1.02]"
          >
            <MessageSquare size={16} strokeWidth={1.75} />
            شروع گفتگو
          </Link>
        </div>

        <div className="grid gap-4 pb-10 lg:grid-cols-2">
          {filtered.map((wf, i) => (
            <WorkflowCard key={wf.id} wf={wf} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="py-12 text-center text-text-tertiary" hover={false}>
            گردش‌کاری در این دسته یافت نشد.
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, ...spring.soft }}
          className="mb-8"
        >
          <Card variant="insight" hover={false} padding="lg">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-indigo/10">
                <Sparkles size={22} className="text-accent-indigo" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[16px] font-semibold text-text-primary">
                  ساخت Workflow توسط AI — ویژگی امضای THEMACHINE
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                  وقتی مدیر مرکز بارها بپرسد «کدام گزارش‌ها آماده‌اند؟» یا «کدام
                  پزشک تأخیر دارد؟»، THEMACHINE الگو را تشخیص می‌دهد و پیشنهاد
                  می‌دهد: «این فرآیند ۳۷ بار در ۱۰ روز تکرار شده — خودکارش
                  کنم؟»
                </p>
                <Link
                  href="/workflows/wf-ai-detected"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-indigo hover:underline"
                >
                  مشاهده نمونه گردش‌کار AI
                  <ArrowLeft size={14} strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
