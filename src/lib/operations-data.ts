import type { Workflow } from "@/types/workflow";
import { workflowStatus } from "@/types/workflow";
import { getCategoryLabel } from "@/config/workflow-categories";

export interface OperationalEvent {
  id: string;
  time: string;
  label: string;
  workflowId: string;
  workflowName: string;
  tone: "neutral" | "success" | "warning" | "critical";
}

export interface ExecutionNode {
  id: string;
  workflowId: string;
  name: string;
  category: string;
  status: "flowing" | "idle" | "alert";
  load: number;
  x: number;
  y: number;
}

const EVENTS: OperationalEvent[] = [
  { id: "e1", time: "۱۱:۵۲", label: "گزارش MRI بیمار ۲۱۴ تأیید شد", workflowId: "wf-mri-report-prep", workflowName: "آماده‌سازی گزارش MRI", tone: "success" },
  { id: "e2", time: "۱۱:۴۸", label: "استعلام بیمه بیمار ۲۱۶ — تأیید", workflowId: "wf-insurance-check", workflowName: "بررسی وضعیت بیمه", tone: "neutral" },
  { id: "e3", time: "۱۱:۴۱", label: "QC دستگاه MRI-2 — هشدار", workflowId: "wf-device-health", workflowName: "پایش سلامت دستگاه", tone: "warning" },
  { id: "e4", time: "۱۱:۳۵", label: "۳ گزارش معوق — نیاز به توجه", workflowId: "wf-report-delay-alert", workflowName: "هشدار تأخیر گزارش", tone: "critical" },
  { id: "e5", time: "۱۱:۲۲", label: "ارسال نتیجه به بیمار ۱۹۸", workflowId: "wf-auto-results", workflowName: "ارسال خودکار نتایج", tone: "success" },
  { id: "e6", time: "۱۱:۱۵", label: "۴۷ نوبت فردا برنامه‌ریزی شد", workflowId: "wf-tomorrow-appointments", workflowName: "مدیریت نوبت فردا", tone: "neutral" },
];

export function buildOperationalEvents(workflows: Workflow[]): OperationalEvent[] {
  const active = workflows.filter((w) => w.enabled);
  return EVENTS.filter((e) => active.some((w) => w.id === e.workflowId));
}

export function buildExecutionMap(workflows: Workflow[]): ExecutionNode[] {
  const active = workflows.filter((w) => w.enabled).slice(0, 8);
  const positions = [
    { x: 12, y: 28 },
    { x: 32, y: 18 },
    { x: 52, y: 32 },
    { x: 72, y: 22 },
    { x: 22, y: 58 },
    { x: 48, y: 62 },
    { x: 68, y: 52 },
    { x: 88, y: 38 },
  ];
  return active.map((wf, i) => {
    const st = workflowStatus(wf);
    return {
      id: wf.id,
      workflowId: wf.id,
      name: wf.name,
      category: getCategoryLabel(wf.category),
      status: st === "warning" ? "alert" : st === "active" ? "flowing" : "idle",
      load: Math.min(100, wf.runsToday * 2 + wf.automationScore / 2),
      x: positions[i]?.x ?? 50,
      y: positions[i]?.y ?? 50,
    };
  });
}

/** 7 days × 24 hours intensity 0–1 */
export function buildActivityHeatmap(): number[][] {
  const grid: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    for (let h = 0; h < 24; h++) {
      const peak = h >= 8 && h <= 18;
      const weekend = d >= 5;
      row.push(
        peak && !weekend
          ? 0.3 + Math.sin(h * 0.5 + d) * 0.25 + 0.2
          : 0.05 + Math.random() * 0.15
      );
    }
    grid.push(row);
  }
  return grid;
}

export function buildOperationsNarrative(workflows: Workflow[]): {
  headline: string;
  subline: string;
  liveCount: number;
  alertCount: number;
} {
  const active = workflows.filter((w) => w.enabled);
  const alerts = active.filter((w) => workflowStatus(w) === "warning" || w.issue);
  const runs = active.reduce((s, w) => s + w.runsToday, 0);
  return {
    headline: `${runs} اجرای زنده در ${active.length} فرآیند`,
    subline:
      alerts.length > 0
        ? `${alerts.length} فرآیند نیاز به توجه — MRI و گزارش‌دهی در کانون فعالیت`
        : "همه سیستم‌ها در جریان — پردیس نور در حالت عملیاتی عادی",
    liveCount: runs,
    alertCount: alerts.length,
  };
}

export function buildWorkflowHealth(workflows: Workflow[]) {
  return workflows
    .filter((w) => w.enabled)
    .slice(0, 6)
    .map((wf) => ({
      id: wf.id,
      name: wf.name,
      score: wf.successRate,
      automation: wf.automationScore,
      status: workflowStatus(wf),
    }));
}
