/** Dashboard & analytics — separate from workflow process definition */

export type MetricVizType =
  | "live-counter"
  | "tiny-trend"
  | "circular-health"
  | "progress-wave"
  | "mini-timeline"
  | "execution-pulse"
  | "heatmap"
  | "relationship";

export type MetricCategory =
  | "kpi"
  | "trend"
  | "chart"
  | "heatmap"
  | "forecast"
  | "alert";

export interface AnalyticsMetric {
  /** URL-safe id: {sourceWorkflowId}__{widgetId} */
  id: string;
  label: string;
  value: string;
  trend?: string;
  vizType?: MetricVizType;
  category: MetricCategory;
  domainLabel: string;
  /** Provenance — workflow that generates this data */
  sourceWorkflowId: string;
  sourceWorkflowName: string;
  numericValue?: number;
  healthScore?: number;
  sparkline?: number[];
  timeline?: { time: string; label: string }[];
  heatmap?: number[];
  related?: { label: string; value: number }[];
  aiInsight?: string;
  forecast?: string;
}

export interface HeroDashboardCard {
  metricId: string;
  domainLabel: string;
  title: string;
  value: string;
  trendDescription?: string;
  trendUp?: boolean;
  status: "ready" | "suggested";
  sparkline: number[];
  footerLabel: string;
  sourceWorkflowId: string;
  sourceWorkflowName: string;
}
