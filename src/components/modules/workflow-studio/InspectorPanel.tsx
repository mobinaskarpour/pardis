"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Trash2,
  AlertTriangle,
  BookOpen,
  GitBranch,
  Zap,
  Clock,
} from "lucide-react";
import { getNodeDef } from "@/config/workflow-nodes";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian";
import type { CanvasNode, StudioWarning } from "@/types/workflow-studio";
import type { Workflow } from "@/types/workflow";

interface InspectorPanelProps {
  node: CanvasNode | null;
  workflow: Workflow;
  nodeCount: number;
  edgeCount: number;
  warnings: StudioWarning[];
  onUpdateConfig: (id: string, config: Record<string, string>) => void;
  onDelete: (id: string) => void;
}

export function InspectorPanel({
  node,
  workflow,
  nodeCount,
  edgeCount,
  warnings,
  onUpdateConfig,
  onDelete,
}: InspectorPanelProps) {
  const def = node ? getNodeDef(node.defId) : null;
  const nodeWarnings = node
    ? warnings.filter((w) => w.nodeId === node.id)
    : warnings.slice(0, 3);

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-border/60 bg-white/95 backdrop-blur-xl">
      <div className="px-4 py-3 border-b border-border/50">
        <p className="text-[13px] font-semibold text-text-primary">بازرس</p>
        <p className="text-[11px] text-text-muted mt-0.5">
          {node ? def?.title : "نمای کلی Workflow"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {!node || !def ? (
          <div className="p-4 space-y-4">
            <section className="rounded-[14px] bg-bg-subtle/50 p-3.5 space-y-2">
              <p className="text-[12px] font-medium text-text-primary">
                {workflow.name}
              </p>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                {workflow.description}
              </p>
            </section>

            <div className="grid grid-cols-2 gap-2">
              <Stat icon={GitBranch} label="گره" value={toPersianDigits(nodeCount)} />
              <Stat icon={Zap} label="اتصال" value={toPersianDigits(edgeCount)} />
              <Stat icon={Clock} label="اجرا امروز" value={toPersianDigits(workflow.runsToday)} />
              <Stat
                icon={Sparkles}
                label="موفقیت"
                value={`${toPersianDigits(workflow.successRate)}٪`}
              />
            </div>

            {nodeWarnings.length > 0 && (
              <section>
                <p className="text-[11px] font-medium text-text-muted mb-2">
                  هشدارها
                </p>
                <div className="space-y-1.5">
                  {nodeWarnings.map((w) => (
                    <Warning key={w.id} warning={w} />
                  ))}
                </div>
              </section>
            )}

            <p className="text-[11px] text-text-muted text-center pt-2">
              یک گره روی بوم انتخاب کنید
            </p>
          </div>
        ) : (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={spring.soft}
            className="p-4 space-y-4"
          >
            <section>
              <div
                className="h-1 w-10 rounded-full mb-2.5"
                style={{ background: def.color }}
              />
              <h3 className="text-[14px] font-semibold text-text-primary">
                {def.title}
              </h3>
              <p className="text-[11px] text-text-tertiary mt-1">{def.description}</p>
            </section>

            {nodeWarnings.map((w) => (
              <Warning key={w.id} warning={w} />
            ))}

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-2">
                تنظیمات
              </p>
              <div className="space-y-2">
                <Field
                  label="گیرنده"
                  value={node.config.recipient ?? ""}
                  onChange={(v) => onUpdateConfig(node.id, { recipient: v })}
                />
                <Field
                  label="پیام / شرط"
                  value={node.config.message ?? node.config.value ?? ""}
                  onChange={(v) =>
                    onUpdateConfig(node.id, { message: v, value: v })
                  }
                  multiline
                />
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-2">
                نگاشت
              </p>
              <div
                className="rounded-[10px] bg-[#f4f5f7] p-2.5 space-y-1 text-[10px] text-text-secondary font-mono leading-relaxed"
                dir="ltr"
              >
                <p>{"{{patient.name}} → recipient"}</p>
                <p>{"{{report.pdf}} → attachment"}</p>
              </div>
            </section>

            <section className="rounded-[12px] border border-accent-indigo/12 bg-accent-indigo/[0.04] p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} className="text-accent-indigo" />
                <p className="text-[10px] font-medium text-accent-indigo">
                  پیشنهاد AI
                </p>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                برای بیماران VIP شرط اضافه کنید.
              </p>
            </section>

            <section className="flex items-start gap-2 text-[10px] text-text-muted">
              <BookOpen size={12} className="shrink-0 mt-0.5" />
              {def.inputs} ورودی · {def.outputs} خروجی
            </section>

            <button
              type="button"
              onClick={() => onDelete(node.id)}
              className="flex items-center gap-1.5 text-[11px] text-error/80 hover:text-error transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              حذف گره
            </button>
          </motion.div>
        )}
      </div>
    </aside>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GitBranch;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[10px] bg-bg-subtle/60 px-2.5 py-2">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={11} className="text-text-muted" />
        <span className="text-[9px] text-text-muted">{label}</span>
      </div>
      <p className="text-[15px] font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function Warning({ warning }: { warning: StudioWarning }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-[10px] px-2.5 py-2 text-[10px] leading-relaxed",
        warning.type === "error"
          ? "bg-error/6 text-error border border-error/12"
          : "bg-warning/6 text-warning border border-warning/12"
      )}
    >
      <AlertTriangle size={12} className="shrink-0 mt-0.5" />
      {warning.message}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-[10px] border border-border/80 bg-white px-2.5 py-2 text-[12px] focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10";

  return (
    <div>
      <label className="text-[10px] font-medium text-text-muted mb-1 block">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={cn(cls, "resize-none")}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}
