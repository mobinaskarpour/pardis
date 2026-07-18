"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Database,
  FileText,
  Filter,
  FlaskConical,
  GitBranch,
  Mail,
  MessageSquare,
  Plus,
  Save,
  Sparkles,
  Trash2,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Card, EmptyState, Status, type StatusTone } from "@/components/core";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/store/workflow-store";
import {
  workflowStatus,
  type Workflow,
  type WorkflowAction,
  type WorkflowActionType,
  type WorkflowCondition,
  type WorkflowStatus,
} from "@/types/workflow";
import {
  actionTypes,
  conditionFields,
  conditionOperators,
  recipients,
  scheduleFrequencies,
  triggerEvents,
  triggerTypes,
} from "@/config/workflow-options";
import {
  EditorInput,
  EditorSelect,
  EditorTextarea,
  Field,
  Toggle,
} from "./editor-controls";
import { pageLabels } from "@/config/labels";

const actionIcons: Record<WorkflowActionType, LucideIcon> = {
  "send-sms": MessageSquare,
  "send-email": Mail,
  notify: Bell,
  "create-task": ClipboardList,
  "generate-report": FileText,
  archive: Database,
};

const statusMeta: Record<
  WorkflowStatus,
  { label: string; tone: StatusTone; pulse?: boolean }
> = {
  active: { label: "فعال", tone: "success", pulse: true },
  warning: { label: "هشدار", tone: "warning" },
  error: { label: "خطا", tone: "error" },
  paused: { label: "متوقف", tone: "neutral" },
};

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function Connector() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="h-7 w-px bg-border-strong" />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  step,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-soft text-primary">
        <Icon size={17} strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-[14px] font-semibold text-text-primary">
          {toPersianDigits(step)} · {title}
        </p>
        <p className="text-[12px] text-text-tertiary">{subtitle}</p>
      </div>
    </div>
  );
}

export function WorkflowEditorPage({ id }: { id: string }) {
  const stored = useWorkflowStore((s) => s.workflows.find((w) => w.id === id));
  const updateWorkflow = useWorkflowStore((s) => s.updateWorkflow);

  const [draft, setDraft] = useState<Workflow | null>(stored ?? null);
  const [savedFlash, setSavedFlash] = useState(false);

  if (!stored || !draft) {
    return (
      <AppShell pageTitle={pageLabels.workflows}>
        <div className="flex h-full items-center justify-center px-6">
          <EmptyState
            title="گردش‌کار یافت نشد"
            description="این گردش‌کار وجود ندارد یا هنوز ساخته نشده است."
            suggestions={[]}
          />
        </div>
      </AppShell>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(stored);
  const status = workflowStatus(draft);
  const meta = statusMeta[status];

  const patch = (p: Partial<Workflow>) => {
    setDraft((d) => (d ? { ...d, ...p } : d));
    setSavedFlash(false);
  };

  const patchCondition = (cid: string, p: Partial<WorkflowCondition>) =>
    patch({
      conditions: draft.conditions.map((c) =>
        c.id === cid ? { ...c, ...p } : c
      ),
    });

  const patchAction = (aid: string, p: Partial<WorkflowAction>) =>
    patch({
      actions: draft.actions.map((a) => (a.id === aid ? { ...a, ...p } : a)),
    });

  const save = () => {
    updateWorkflow(id, draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  const testRun = () => {
    const run = {
      id: generateId("run"),
      time: "همین الان",
      status: "success" as const,
      detail: "اجرای آزمایشی توسط مدیرعامل — همه اقدامات شبیه‌سازی شدند",
    };
    const next = {
      ...draft,
      runs: [run, ...draft.runs],
      lastRun: "همین الان",
      runsToday: draft.runsToday + 1,
    };
    setDraft(next);
    updateWorkflow(id, next);
  };

  return (
    <AppShell pageTitle={pageLabels.workflows}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="mb-8"
        >
          <Link
            href="/workflows"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary transition-colors duration-[120ms] hover:text-text-secondary"
          >
            <ArrowRight size={14} strokeWidth={1.75} />
            بازگشت به گردش‌کارها
          </Link>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <input
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                className="w-full max-w-2xl bg-transparent text-[28px] font-semibold leading-tight text-text-primary outline-none border-b border-transparent focus:border-border-hover transition-colors duration-[120ms]"
                aria-label="نام گردش‌کار"
              />
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Status label={meta.label} tone={meta.tone} pulse={meta.pulse} />
                {draft.source === "ai" && (
                  <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-accent-indigo/10 px-2 py-0.5 text-[12px] font-medium text-accent-indigo">
                    <Sparkles size={12} strokeWidth={1.75} />
                    {draft.createdFrom ?? "ساخته‌شده از گفتگو"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Toggle
                checked={draft.enabled}
                onChange={(enabled) => patch({ enabled })}
                label={draft.enabled ? "فعال" : "غیرفعال"}
              />
              <button
                type="button"
                onClick={testRun}
                className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-border px-3.5 py-2 text-[13px] font-medium text-text-secondary transition-colors duration-[120ms] hover:border-border-hover hover:text-text-primary"
              >
                <FlaskConical size={15} strokeWidth={1.75} />
                اجرای آزمایشی
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!dirty}
                className={cn(
                  "flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors duration-[120ms]",
                  dirty
                    ? "cursor-pointer bg-primary text-white hover:opacity-90"
                    : savedFlash
                      ? "border border-success/30 bg-success/10 text-success"
                      : "border border-border text-text-tertiary opacity-60"
                )}
              >
                {savedFlash ? (
                  <CheckCircle2 size={15} strokeWidth={1.75} />
                ) : (
                  <Save size={15} strokeWidth={1.75} />
                )}
                {savedFlash ? "ذخیره شد" : "ذخیره تغییرات"}
              </button>
            </div>
          </div>

          <EditorTextarea
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
            className="mt-4 max-w-2xl bg-transparent"
            aria-label="توضیح گردش‌کار"
          />
        </motion.header>

        <div className="grid grid-cols-1 gap-6 pb-10 xl:grid-cols-[1fr_300px]">
          {/* Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, ...spring.soft }}
          >
            {/* Trigger */}
            <Card hover={false}>
              <SectionHeader
                icon={Zap}
                step={1}
                title="محرک"
                subtitle="چه زمانی این گردش‌کار اجرا شود؟"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="نوع محرک">
                  <EditorSelect
                    value={draft.trigger.type}
                    options={triggerTypes}
                    onChange={(type) =>
                      patch({
                        trigger: {
                          ...draft.trigger,
                          type: type as Workflow["trigger"]["type"],
                        },
                      })
                    }
                  />
                </Field>

                {draft.trigger.type === "schedule" && (
                  <>
                    <Field label="تکرار">
                      <EditorSelect
                        value={draft.trigger.frequency ?? "daily"}
                        options={scheduleFrequencies}
                        onChange={(frequency) =>
                          patch({
                            trigger: {
                              ...draft.trigger,
                              frequency:
                                frequency as Workflow["trigger"]["frequency"],
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="ساعت اجرا">
                      <EditorInput
                        type="time"
                        dir="ltr"
                        value={draft.trigger.time ?? "08:00"}
                        onChange={(e) =>
                          patch({
                            trigger: { ...draft.trigger, time: e.target.value },
                          })
                        }
                      />
                    </Field>
                  </>
                )}

                {draft.trigger.type === "event" && (
                  <Field label="رویداد" className="sm:col-span-2">
                    <EditorSelect
                      value={draft.trigger.event ?? triggerEvents[0].id}
                      options={triggerEvents}
                      onChange={(event) =>
                        patch({ trigger: { ...draft.trigger, event } })
                      }
                    />
                  </Field>
                )}
              </div>
            </Card>

            <Connector />

            {/* Conditions */}
            <Card hover={false}>
              <SectionHeader
                icon={Filter}
                step={2}
                title="شرایط"
                subtitle="فقط وقتی همه شرایط برقرار باشند ادامه می‌دهد (AND)"
              />

              {draft.conditions.length === 0 && (
                <p className="mb-3 rounded-[10px] bg-bg-subtle/60 p-3 text-[13px] text-text-tertiary">
                  بدون شرط — با هر بار فعال شدن محرک، اقدامات اجرا می‌شوند.
                </p>
              )}

              <div className="space-y-2.5">
                {draft.conditions.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <Field label="فیلد">
                      <EditorSelect
                        value={c.field}
                        options={conditionFields}
                        onChange={(field) => patchCondition(c.id, { field })}
                      />
                    </Field>
                    <Field label="عملگر">
                      <EditorSelect
                        value={c.operator}
                        options={conditionOperators}
                        onChange={(operator) =>
                          patchCondition(c.id, {
                            operator:
                              operator as WorkflowCondition["operator"],
                          })
                        }
                      />
                    </Field>
                    <Field label="مقدار">
                      <EditorInput
                        value={c.value}
                        onChange={(e) =>
                          patchCondition(c.id, { value: e.target.value })
                        }
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          conditions: draft.conditions.filter(
                            (x) => x.id !== c.id
                          ),
                        })
                      }
                      className="mb-0.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border border-border text-text-tertiary transition-colors duration-[120ms] hover:border-error/30 hover:text-error"
                      aria-label="حذف شرط"
                    >
                      <Trash2 size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  patch({
                    conditions: [
                      ...draft.conditions,
                      {
                        id: generateId("cond"),
                        field: conditionFields[0].id,
                        operator: "eq",
                        value: "",
                      },
                    ],
                  })
                }
                className="mt-3 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity duration-[120ms] hover:opacity-80"
              >
                <Plus size={14} strokeWidth={2} />
                افزودن شرط
              </button>
            </Card>

            <Connector />

            {/* Actions */}
            <Card hover={false}>
              <SectionHeader
                icon={GitBranch}
                step={3}
                title="اقدامات"
                subtitle="این کارها به ترتیب و به‌صورت خودکار انجام می‌شوند"
              />

              <div className="space-y-3">
                {draft.actions.map((a, i) => {
                  const Icon = actionIcons[a.type];
                  return (
                    <div
                      key={a.id}
                      className="rounded-[12px] border border-border bg-bg/60 p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-accent-indigo/10 text-accent-indigo">
                          <Icon size={15} strokeWidth={1.75} />
                        </span>
                        <span className="text-[12px] font-medium text-text-tertiary">
                          مرحله {toPersianDigits(i + 1)}
                        </span>
                        <EditorSelect
                          value={a.type}
                          options={actionTypes}
                          onChange={(type) =>
                            patchAction(a.id, {
                              type: type as WorkflowActionType,
                            })
                          }
                          className="w-44"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            patch({
                              actions: draft.actions.filter(
                                (x) => x.id !== a.id
                              ),
                            })
                          }
                          className="mr-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-border text-text-tertiary transition-colors duration-[120ms] hover:border-error/30 hover:text-error"
                          aria-label="حذف اقدام"
                        >
                          <Trash2 size={14} strokeWidth={1.75} />
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[220px_1fr]">
                        <Field label="گیرنده">
                          <EditorSelect
                            value={a.recipient ?? recipients[0].id}
                            options={recipients}
                            onChange={(recipient) =>
                              patchAction(a.id, { recipient })
                            }
                          />
                        </Field>
                        <Field label="متن / جزئیات">
                          <EditorTextarea
                            value={a.message ?? ""}
                            onChange={(e) =>
                              patchAction(a.id, { message: e.target.value })
                            }
                            placeholder="می‌توانید از متغیرهایی مثل {نام بیمار} استفاده کنید"
                          />
                        </Field>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() =>
                  patch({
                    actions: [
                      ...draft.actions,
                      {
                        id: generateId("act"),
                        type: "notify",
                        recipient: recipients[0].id,
                        message: "",
                      },
                    ],
                  })
                }
                className="mt-3 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity duration-[120ms] hover:opacity-80"
              >
                <Plus size={14} strokeWidth={2} />
                افزودن اقدام
              </button>
            </Card>
          </motion.div>

          {/* Side panel */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, ...spring.soft }}
            className="space-y-4 xl:sticky xl:top-4 xl:self-start"
          >
            <Card hover={false} hero="وضعیت اجرا">
              <ul className="space-y-3 text-[13px]">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-text-tertiary">
                    <Clock3 size={14} strokeWidth={1.75} />
                    آخرین اجرا
                  </span>
                  <span className="text-text-secondary">{draft.lastRun}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-text-tertiary">اجرای امروز</span>
                  <span className="font-medium text-text-primary">
                    {toPersianDigits(draft.runsToday)}
                  </span>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">نرخ موفقیت</span>
                    <span className="font-medium text-text-primary">
                      {toPersianDigits(draft.successRate)}٪
                    </span>
                  </div>
                  <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-bg-subtle">
                    <span
                      className={cn(
                        "absolute inset-y-0 right-0 rounded-full",
                        draft.successRate >= 95
                          ? "bg-success"
                          : draft.successRate >= 85
                            ? "bg-warning"
                            : "bg-error"
                      )}
                      style={{ width: `${draft.successRate}%` }}
                    />
                  </div>
                </li>
              </ul>
            </Card>

            {draft.issue && (
              <div
                className={cn(
                  "flex items-start gap-2.5 rounded-[14px] border p-4 text-[13px] leading-relaxed",
                  draft.health === "error"
                    ? "border-error/25 bg-error/5 text-error"
                    : "border-warning/25 bg-warning/5 text-warning"
                )}
              >
                <AlertTriangle
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0"
                />
                {draft.issue}
              </div>
            )}

            <Card hover={false} hero="تاریخچه اجرا">
              {draft.runs.length === 0 ? (
                <p className="text-[13px] text-text-tertiary">
                  هنوز اجرایی ثبت نشده است.
                </p>
              ) : (
                <ul className="space-y-3">
                  {draft.runs.map((run) => (
                    <li key={run.id} className="flex items-start gap-2.5">
                      {run.status === "success" ? (
                        <CheckCircle2
                          size={15}
                          strokeWidth={1.75}
                          className="mt-0.5 shrink-0 text-success"
                        />
                      ) : (
                        <XCircle
                          size={15}
                          strokeWidth={1.75}
                          className="mt-0.5 shrink-0 text-error"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] text-text-tertiary">
                          {run.time}
                        </p>
                        {run.detail && (
                          <p className="mt-0.5 text-[13px] leading-relaxed text-text-secondary">
                            {run.detail}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </motion.aside>
        </div>
      </div>
    </AppShell>
  );
}

