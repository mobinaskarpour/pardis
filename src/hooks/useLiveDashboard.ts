"use client";

import { useEffect, useMemo, useState } from "react";
import type { Workflow } from "@/types/workflow";
import {
  buildDashboardGroups,
  tickWidgetValue,
  type DashboardWidgetInstance,
  type WorkflowDashboardGroup,
} from "@/lib/dashboard-widgets";

export function useLiveDashboard(workflows: Workflow[]) {
  const [tick, setTick] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  const baseGroups = useMemo(
    () => buildDashboardGroups(workflows),
    [workflows]
  );

  const groups: WorkflowDashboardGroup[] = useMemo(() => {
    if (tick === 0) return baseGroups;
    return baseGroups.map((group) => ({
      ...group,
      widgets: group.widgets.map((w) => tickWidgetValue(w)),
    }));
  }, [baseGroups, tick]);

  const allWidgets = useMemo(
    () => groups.flatMap((g) => g.widgets),
    [groups]
  );

  const insights = useMemo(() => {
    const items: string[] = [];
    for (const wf of workflows.filter((w) => w.enabled)) {
      if (wf.issue) items.push(`⚠ ${wf.name}: ${wf.issue}`);
      for (const opt of wf.aiOptimizations.slice(0, 1)) {
        items.push(`✦ ${opt.suggestion}`);
      }
    }
    if (items.length === 0) {
      items.push("✦ THE MACHINE در حال یادگیری از اجرای گردش‌کارهاست…");
    }
    return items;
  }, [workflows]);

  useEffect(() => {
    const counter = setInterval(() => setTick((t) => t + 1), 8000);
    const insight = setInterval(
      () => setInsightIndex((i) => (i + 1) % Math.max(insights.length, 1)),
      5000
    );
    return () => {
      clearInterval(counter);
      clearInterval(insight);
    };
  }, [insights.length]);

  const currentInsight = insights[insightIndex] ?? insights[0];

  return { groups, allWidgets, currentInsight, tick };
}

export type { DashboardWidgetInstance, WorkflowDashboardGroup };
