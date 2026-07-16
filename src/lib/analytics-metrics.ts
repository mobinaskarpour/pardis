import type { Workflow } from "@/types/workflow";
import type { AnalyticsMetric, HeroDashboardCard } from "@/types/dashboard";
import { getCategoryLabel } from "@/config/workflow-categories";
import { getWorkflowWidgets, type DashboardWidgetInstance } from "@/lib/dashboard-widgets";

export function metricId(sourceWorkflowId: string, widgetId: string): string {
  return `${sourceWorkflowId}__${widgetId}`;
}

export function parseMetricId(id: string): { workflowId: string; widgetId: string } | null {
  const idx = id.indexOf("__");
  if (idx <= 0) return null;
  return {
    workflowId: id.slice(0, idx),
    widgetId: id.slice(idx + 2),
  };
}

export function analyticsDetailHref(sourceWorkflowId: string, widgetId: string): string {
  return `/analytics/${encodeURIComponent(metricId(sourceWorkflowId, widgetId))}`;
}

const CATEGORY_MAP: Record<string, AnalyticsMetric["category"]> = {
  "live-counter": "kpi",
  "tiny-trend": "trend",
  "circular-health": "chart",
  "progress-wave": "chart",
  "mini-timeline": "chart",
  "execution-pulse": "alert",
  heatmap: "heatmap",
  relationship: "chart",
};

const INSIGHTS: Record<string, string> = {
  "wf-mri-report-prep":
    "روند گزارش‌دهی ۸٪ بهبود یافته — ظرفیت تأیید دکتر کریمی در ساعات اوج محدود است.",
  "wf-insurance-check":
    "پردازش بیمه ۱۲ ثانیه سریع‌تر شده — نرخ رد پوشش در بیمه تأمین اجتماعی بالاتر است.",
  "wf-daily-analytics":
    "درآمد امروز ۵٪ بالاتر از میانگین هفته — MRI بیشترین سهم را دارد.",
  "wf-device-health":
    "MRI-2 نیاز به QC دارد — پیش‌بینی downtime ۴ ساعته در آخر هفته.",
};

function widgetToMetric(
  workflow: Workflow,
  widget: DashboardWidgetInstance
): AnalyticsMetric {
  const id = metricId(workflow.id, widget.id);
  return {
    id,
    label: widget.label,
    value: widget.value,
    trend: widget.trend,
    vizType: widget.vizType,
    category: CATEGORY_MAP[widget.vizType ?? "live-counter"] ?? "kpi",
    domainLabel: getCategoryLabel(workflow.category),
    sourceWorkflowId: workflow.id,
    sourceWorkflowName: workflow.name,
    numericValue: widget.numericValue,
    healthScore: widget.healthScore,
    sparkline: widget.sparkline,
    timeline: widget.timeline,
    heatmap: widget.heatmap,
    related: widget.related,
    aiInsight: INSIGHTS[workflow.id],
    forecast:
      widget.vizType === "tiny-trend"
        ? "روند صعودی تا پایان هفته پیش‌بینی می‌شود"
        : undefined,
  };
}

export function buildAnalyticsMetrics(workflows: Workflow[]): AnalyticsMetric[] {
  return workflows
    .filter((w) => w.enabled)
    .flatMap((wf) =>
      getWorkflowWidgets(wf).map((widget) =>
        widgetToMetric(wf, {
          ...widget,
          workflowId: wf.id,
          workflowName: wf.name,
          workflowCategory: wf.category,
        })
      )
    );
}

export function findAnalyticsMetric(
  workflows: Workflow[],
  metricIdStr: string
): AnalyticsMetric | null {
  const parsed = parseMetricId(decodeURIComponent(metricIdStr));
  if (!parsed) return null;
  const wf = workflows.find((w) => w.id === parsed.workflowId);
  if (!wf) return null;
  const widget = getWorkflowWidgets(wf).find((w) => w.id === parsed.widgetId);
  if (!widget) return null;
  return widgetToMetric(wf, {
    ...widget,
    workflowId: wf.id,
    workflowName: wf.name,
    workflowCategory: wf.category,
  });
}

export interface MetricDetailContext {
  workflow: Workflow;
  metric: AnalyticsMetric;
  siblingMetrics: AnalyticsMetric[];
  comparison: {
    latest: number;
    previous: number;
    changePct: number;
    weekAvg: number;
    weekHigh: number;
    weekLow: number;
  };
}

export function buildMetricDetailContext(
  workflows: Workflow[],
  metricIdStr: string
): MetricDetailContext | null {
  const parsed = parseMetricId(decodeURIComponent(metricIdStr));
  if (!parsed) return null;
  const wf = workflows.find((w) => w.id === parsed.workflowId);
  if (!wf) return null;
  const metric = findAnalyticsMetric(workflows, metricIdStr);
  if (!metric) return null;

  const siblings = getWorkflowWidgets(wf)
    .filter((w) => w.id !== parsed.widgetId)
    .map((widget) =>
      widgetToMetric(wf, {
        ...widget,
        workflowId: wf.id,
        workflowName: wf.name,
        workflowCategory: wf.category,
      })
    );

  const points = metric.sparkline ?? [10, 12, 11, 14, 13, 15, 16];
  const latest = points[points.length - 1] ?? 0;
  const previous = points[points.length - 2] ?? latest;
  const changePct =
    previous === 0 ? 0 : Math.round(((latest - previous) / previous) * 100);
  const weekAvg = Math.round(
    (points.reduce((s, p) => s + p, 0) / points.length) * 10
  ) / 10;
  const weekHigh = Math.max(...points);
  const weekLow = Math.min(...points);

  return {
    workflow: wf,
    metric,
    siblingMetrics: siblings,
    comparison: { latest, previous, changePct, weekAvg, weekHigh, weekLow },
  };
}

/** @deprecated Use analyticsDetailHref */
export function widgetDetailHref(
  workflowId: string,
  widget: { id: string }
): string {
  return analyticsDetailHref(workflowId, widget.id);
}

/** Hero cards for Mission Control — analytics only */
const HERO_WORKFLOW_ORDER = [
  "wf-mri-report-prep",
  "wf-daily-analytics",
  "wf-tomorrow-appointments",
  "wf-insurance-check",
  "wf-device-health",
  "wf-auto-results",
  "wf-report-delay-alert",
  "wf-ai-detected",
];

const TREND_COPY: Record<string, { desc: string; up?: boolean }> = {
  "wf-mri-report-prep": { desc: "۳ گزارش بیشتر نسبت به دیروز", up: true },
  "wf-daily-analytics": { desc: "درآمد ۵٪ بیشتر از هفته گذشته", up: true },
  "wf-tomorrow-appointments": { desc: "نرخ غیبت ۲٪ کمتر", up: true },
  "wf-insurance-check": { desc: "پردازش ۱۲ ثانیه سریع‌تر", up: true },
  "wf-device-health": { desc: "۱ هشدار QC — MRI-2", up: false },
  "wf-auto-results": { desc: "نرخ باز شدن ۵٪ بیشتر", up: true },
  "wf-report-delay-alert": { desc: "۳ گزارش معوق — نیاز به توجه", up: false },
  "wf-ai-detected": { desc: "از ۳۷ گفتگوی تکراری ساخته شد", up: true },
};

function pickHeroWidget(widgets: DashboardWidgetInstance[]) {
  return (
    widgets.find(
      (w) =>
        w.vizType === "live-counter" ||
        w.vizType === "tiny-trend" ||
        w.id.includes("reports") ||
        w.id.includes("revenue")
    ) ?? widgets[0]
  );
}

export function buildHeroDashboardCards(workflows: Workflow[]): HeroDashboardCard[] {
  const enabled = workflows.filter((w) => w.enabled);
  const ordered = HERO_WORKFLOW_ORDER.map((id) =>
    enabled.find((w) => w.id === id)
  ).filter(Boolean) as Workflow[];

  const extras = enabled.filter((w) => !HERO_WORKFLOW_ORDER.includes(w.id));
  const all = [...ordered, ...extras].slice(0, 8);

  return all.map((workflow) => {
    const widgets = getWorkflowWidgets(workflow).map((w) => ({
      ...w,
      workflowId: workflow.id,
      workflowName: workflow.name,
      workflowCategory: workflow.category,
    }));
    const widget = pickHeroWidget(widgets);
    const trend = TREND_COPY[workflow.id];
    const sparkline = widget.sparkline ?? [12, 14, 13, 16, 15, 18, 17];

    return {
      metricId: metricId(workflow.id, widget.id),
      domainLabel: getCategoryLabel(workflow.category),
      title: widget.label,
      value:
        workflow.id === "wf-daily-analytics" && widget.id === "revenue"
          ? "۴۸.۲M"
          : widget.value,
      trendDescription: trend?.desc ?? widget.trend,
      trendUp: trend?.up ?? !widget.trend?.startsWith("-"),
      status: workflow.source === "ai" ? "suggested" : "ready",
      sparkline,
      footerLabel: "داده زنده · کلیک برای تحلیل",
      sourceWorkflowId: workflow.id,
      sourceWorkflowName: workflow.name,
    };
  });
}
