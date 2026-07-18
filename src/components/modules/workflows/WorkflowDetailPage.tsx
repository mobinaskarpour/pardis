"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitBranch,
  MessageSquare,
  Play,
  Plug,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Button, Card, Status } from "@/components/core";
import { getCategoryEmoji, getCategoryLabel } from "@/config/workflow-categories";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/store/workflow-store";
import { workflowStatus, type Workflow } from "@/types/workflow";
import { triggerLabelFor } from "@/lib/workflow-detection";
import { optionLabel, triggerEvents } from "@/config/workflow-options";
import { WorkflowCanvasFlow } from "./detail/WorkflowCanvasFlow";
import { WorkflowRunTimeline } from "./detail/WorkflowRunTimeline";

interface WorkflowDetailPageProps {
  id: string;
}

const SECTIONS = [
  { id: "summary", label: "خلاصه AI" },
  { id: "story", label: "داستان فرآیند" },
  { id: "connections", label: "اتصالات" },
  { id: "steps", label: "مراحل کسب‌وکار" },
  { id: "canvas", label: "Canvas" },
  { id: "simulation", label: "شبیه‌سازی" },
  { id: "execution", label: "تاریخچه اجرا" },
  { id: "versions", label: "نسخه‌ها" },
  { id: "logs", label: "لاگ‌ها" },
] as const;

function triggerText(wf: Workflow): string {
  if (wf.trigger.type === "event")
    return optionLabel(triggerEvents, wf.trigger.event);
  return triggerLabelFor(wf);
}

const MOCK_LOGS = [
  { time: "۱۱:۵۲:۰۳", level: "info", msg: "استعلام بیمه — بیمار ۲۱۶ — موفق" },
  { time: "۱۱:۵۱:۴۱", level: "info", msg: "محاسبه سهم بیمار — ۴۵۰,۰۰۰ تومان" },
  { time: "۱۱:۴۸:۱۲", level: "warn", msg: "تأخیر پاسخ API بیمه — ۳.۲ ثانیه" },
];

const MOCK_VERSIONS = [
  { v: "۱.۲", date: "۱۴۰۴/۰۱/۱۰", note: "پیش‌بینی رد پوشش" },
  { v: "۱.۱", date: "۱۴۰۳/۱۲/۲۰", note: "اتصال Accounting API" },
  { v: "۱.۰", date: "۱۴۰۳/۱۱/۰۵", note: "نسخه اولیه AI" },
];

const MOCK_PERMISSIONS = [
  { role: "مدیر بخش", access: "ویرایش + اجرا" },
  { role: "مسئول پذیرش", access: "مشاهده + تأیید" },
  { role: "حسابداری", access: "مشاهده" },
];

export function WorkflowDetailPage({ id }: WorkflowDetailPageProps) {
  const searchParams = useSearchParams();
  const highlightSection = searchParams.get("section");
  const [activeSection, setActiveSection] = useState("summary");
  const [simStep, setSimStep] = useState(0);

  const workflow = useWorkflowStore((s) => s.workflows.find((w) => w.id === id));

  useEffect(() => {
    if (!highlightSection) return;
    const timer = setTimeout(() => {
      document
        .getElementById(`section-${highlightSection}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, [highlightSection, id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sid = entry.target.getAttribute("data-section");
            if (sid) setActiveSection(sid);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [id, workflow]);

  useEffect(() => {
    setSimStep(0);
  }, [id]);

  if (!workflow) {
    return (
      <AppShell>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-text-secondary">گردش‌کار یافت نشد</p>
        </div>
      </AppShell>
    );
  }

  const wf = workflow;
  const status = workflowStatus(wf);
  const statusLabel =
    status === "active"
      ? "فعال"
      : status === "warning"
        ? "هشدار"
        : status === "error"
          ? "خطا"
          : "متوقف";

  return (
    <AppShell pageTitle={wf.name}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.soft}
            className="mb-8"
          >
            <Link
              href="/workflows"
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-tertiary hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={1.75} />
              بازگشت به ورک‌فلو
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-text-tertiary">
                  {getCategoryLabel(wf.category)} · {triggerText(wf)}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                  <span className="text-[28px]" aria-hidden>
                    {getCategoryEmoji(wf.category)}
                  </span>
                  <h1 className="text-[36px] font-semibold leading-tight text-text-primary">
                    {wf.name}
                  </h1>
                  <Status
                    label={statusLabel}
                    tone={
                      status === "active"
                        ? "success"
                        : status === "warning"
                          ? "warning"
                          : status === "error"
                            ? "error"
                            : "neutral"
                    }
                    pulse={status === "active"}
                  />
                  {wf.source === "ai" && (
                    <span className="inline-flex items-center gap-1 rounded-[8px] bg-accent-indigo/10 px-2.5 py-1 text-[11px] font-bold text-accent-indigo">
                      <Sparkles size={12} strokeWidth={1.75} />
                      AI Generated
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13px] text-text-muted">
                  Automation Score: {toPersianDigits(wf.automationScore)} · آخرین
                  اجرا: {wf.lastRun} · امروز: {toPersianDigits(wf.runsToday)} اجرا
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href={`/workflows/${wf.id}/studio`}>
                  <Button variant="primary" size="md">
                    <GitBranch size={15} strokeWidth={1.75} />
                    Workflow Canvas
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="subtle" size="md">
                    <TrendingUp size={14} strokeWidth={1.75} />
                    مرکز فرمان
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Automation", value: wf.automationScore },
                { label: "موفقیت", value: `${wf.successRate}٪` },
                { label: "اجرای امروز", value: wf.runsToday },
                { label: "اتصالات", value: wf.connectedSystems.length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[14px] border border-border bg-bg-elevated/80 px-4 py-3"
                >
                  <p className="text-[20px] font-bold text-text-primary tabular-nums">
                    {toPersianDigits(stat.value)}
                  </p>
                  <p className="text-[11px] text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.header>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 space-y-6">
              <nav className="sticky top-0 z-20 -mx-1 overflow-x-auto px-1 pb-1 scrollbar-none">
                <div className="inline-flex gap-1 rounded-[14px] border border-border bg-bg-elevated/95 p-1 backdrop-blur-md shadow-[var(--shadow-sm)]">
                  {SECTIONS.map((s) => (
                    <a
                      key={s.id}
                      href={`#section-${s.id}`}
                      className={cn(
                        "shrink-0 rounded-[10px] px-3 py-2 text-[12px] font-medium transition-all",
                        activeSection === s.id
                          ? "bg-primary/10 text-primary"
                          : "text-text-tertiary hover:text-text-secondary"
                      )}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </nav>
          <div id="section-summary" data-section="summary" className="scroll-mt-28">
            <Card
              variant="insight"
              hero="خلاصه AI"
              subtitle="THEMACHINE این فرآیند را چگونه می‌بیند"
              hover={false}
              padding="lg"
            >
              <div className="flex items-start gap-3">
                <Sparkles
                  size={18}
                  strokeWidth={1.75}
                  className="text-accent-indigo shrink-0 mt-0.5"
                />
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  {wf.whyAICreated ?? wf.executiveSummary}
                </p>
              </div>
              {wf.aiOptimizations.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {wf.aiOptimizations.map((opt) => (
                    <li
                      key={opt.id}
                      className="text-[13px] text-text-secondary leading-relaxed"
                    >
                      ✦ {opt.suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div id="section-story" data-section="story" className="scroll-mt-28">
            <Card
              variant="workflow"
              hero="داستان فرآیند"
              subtitle="این گردش‌کار چگونه کار می‌کند — به زبان کسب‌وکار"
              hover={false}
              padding="lg"
            >
              <p className="text-[15px] leading-[1.85] text-text-secondary">
                {wf.executiveSummary}
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-text-tertiary">
                {wf.description}
              </p>
              {wf.conversationOrigin && (
                <div className="mt-5 rounded-[14px] border border-border bg-bg-subtle/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={15} className="text-accent-indigo" />
                    <span className="text-[13px] font-semibold text-text-primary">
                      منشأ گفتگو
                    </span>
                  </div>
                  <p className="text-[12px] text-text-tertiary mb-2">
                    {toPersianDigits(wf.conversationOrigin.repeatCount)} بار در{" "}
                    {toPersianDigits(wf.conversationOrigin.repeatPeriodDays)} روز
                  </p>
                  <ul className="space-y-1.5">
                    {wf.conversationOrigin.sampleQueries.map((q) => (
                      <li
                        key={q}
                        className="rounded-[8px] bg-bg-elevated px-2.5 py-1.5 text-[12px] text-text-secondary"
                      >
                        «{q}»
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          <div
            id="section-connections"
            data-section="connections"
            className="scroll-mt-28 grid gap-4 sm:grid-cols-2"
          >
            <Card
              variant="default"
              hero="اتصالات مورد نیاز"
              hover={false}
              padding="md"
            >
              <div className="flex flex-wrap gap-1.5">
                {wf.connectedSystems.map((sys) => (
                  <span
                    key={sys}
                    className="inline-flex items-center gap-1 rounded-[8px] bg-bg-subtle px-2.5 py-1 text-[11px] font-medium text-text-secondary"
                  >
                    <Plug size={11} className="text-text-muted" />
                    {sys}
                  </span>
                ))}
              </div>
            </Card>
            <Card
              variant="default"
              hero="تأییدهای مورد نیاز"
              hover={false}
              padding="md"
            >
              <ul className="space-y-2">
                {wf.approvals.map((a) => (
                  <li
                    key={a.role}
                    className="flex items-center justify-between text-[13px] text-text-secondary"
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield size={13} className="text-text-muted" />
                      {a.role}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        a.required ? "text-primary" : "text-text-muted"
                      )}
                    >
                      {a.required ? "الزامی" : "اختیاری"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div id="section-steps" data-section="steps" className="scroll-mt-28">
            <Card
              hero="مراحل کسب‌وکار"
              subtitle="به زبان ساده — بدون اصطلاحات فنی"
              hover={false}
              padding="lg"
            >
              <ol className="space-y-3">
                {wf.previewSteps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-[12px] border border-border bg-bg-subtle/40 px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                      {toPersianDigits(i + 1)}
                    </span>
                    <span className="text-[14px] text-text-primary leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div id="section-canvas" data-section="canvas" className="scroll-mt-28">
            <Card
              hero="Workflow Canvas"
              subtitle="نمای گرافیکی مسیر فرآیند"
              hover={false}
              padding="lg"
            >
              <WorkflowCanvasFlow steps={wf.previewSteps} />
            </Card>
          </div>

          <div id="section-simulation" data-section="simulation" className="scroll-mt-28">
            <Card
              hero="شبیه‌سازی اجرا"
              subtitle="پیش‌نمایش گام‌به‌گام"
              hover={false}
              padding="lg"
            >
              <div className="rounded-[14px] border border-border bg-bg-subtle/40 p-5">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setSimStep((s) =>
                        Math.min(s + 1, wf.previewSteps.length - 1)
                      )
                    }
                  >
                    <Play size={14} strokeWidth={1.75} />
                    اجرای گام بعد
                  </Button>
                  <button
                    type="button"
                    onClick={() => setSimStep(0)}
                    className="text-[12px] text-text-muted hover:text-text-secondary transition-colors"
                  >
                    از نو
                  </button>
                </div>
                <p className="text-[14px] font-medium text-text-primary">
                  گام {toPersianDigits(simStep + 1)}: {wf.previewSteps[simStep]}
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${((simStep + 1) / wf.previewSteps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div id="section-execution" data-section="execution" className="scroll-mt-28">
            <Card hero="تاریخچه اجرا" hover={false} padding="lg">
              <WorkflowRunTimeline runs={wf.runs} />
            </Card>
          </div>

          <div id="section-versions" data-section="versions" className="scroll-mt-28">
            <Card hero="نسخه‌ها" hover={false} padding="lg">
              <ul className="space-y-2">
                {MOCK_VERSIONS.map((v) => (
                  <li
                    key={v.v}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-border px-4 py-2.5"
                  >
                    <span className="text-[13px] font-semibold text-text-primary">
                      v{toPersianDigits(v.v)}
                    </span>
                    <span className="text-[12px] text-text-muted">{v.date}</span>
                    <span className="text-[12px] text-text-secondary">{v.note}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div id="section-logs" data-section="logs" className="scroll-mt-28">
            <Card hero="لاگ‌ها" hover={false} padding="lg">
              <ul className="space-y-2 font-mono text-[11px]">
                {MOCK_LOGS.map((log) => (
                  <li
                    key={log.time}
                    className="flex gap-3 rounded-[8px] bg-bg-subtle px-3 py-2 text-text-secondary"
                  >
                    <span className="text-text-muted shrink-0">{log.time}</span>
                    <span
                      className={cn(
                        "shrink-0 uppercase font-bold",
                        log.level === "warn" ? "text-warning" : "text-success"
                      )}
                    >
                      {log.level}
                    </span>
                    <span>{log.msg}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card
            hero="دسترسی‌ها"
            hover={false}
            padding="lg"
          >
            <ul className="space-y-2">
              {MOCK_PERMISSIONS.map((p) => (
                <li
                  key={p.role}
                  className="flex items-center justify-between rounded-[10px] bg-bg-subtle px-4 py-2.5"
                >
                  <span className="flex items-center gap-2 text-[13px] text-text-secondary">
                    <Users size={14} strokeWidth={1.75} />
                    {p.role}
                  </span>
                  <span className="text-[11px] font-medium text-text-muted">
                    {p.access}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {wf.issue && (
            <Card variant="alert" hero="هشدار فعال" hover={false} padding="md">
              <p className="text-[14px] text-warning">{wf.issue}</p>
            </Card>
          )}
            </div>

            <aside className="hidden xl:block space-y-4 sticky top-24 self-start">
              <Card variant="workflow" hover={false} padding="md">
                <p className="text-[11px] font-medium text-text-muted mb-3">
                  وضعیت فرآیند
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">Automation</span>
                    <span className="font-bold text-primary tabular-nums">
                      {toPersianDigits(wf.automationScore)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">موفقیت</span>
                    <span className="font-bold text-text-primary tabular-nums">
                      {toPersianDigits(wf.successRate)}٪
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">اجرای امروز</span>
                    <span className="font-bold text-text-primary tabular-nums">
                      {toPersianDigits(wf.runsToday)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${wf.automationScore}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card hover={false} padding="md">
                <p className="text-[11px] font-medium text-text-muted mb-3">
                  پرش به بخش
                </p>
                <ul className="space-y-1">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#section-${s.id}`}
                        className={cn(
                          "block rounded-[8px] px-2.5 py-1.5 text-[12px] transition-colors",
                          activeSection === s.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
                        )}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card hover={false} padding="md">
                <p className="text-[11px] font-medium text-text-muted mb-3">
                  اتصالات فعال
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {wf.connectedSystems.slice(0, 6).map((sys) => (
                    <span
                      key={sys}
                      className="rounded-[6px] bg-bg-subtle px-2 py-0.5 text-[10px] font-medium text-text-secondary"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
                <Link
                  href="/integrations"
                  className="mt-3 inline-flex text-[11px] font-medium text-primary hover:underline"
                >
                  مدیریت اتصالات ←
                </Link>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
