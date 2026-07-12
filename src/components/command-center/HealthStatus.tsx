"use client";

import { StoryMetric } from "@/components/core";

import { uiLabels } from "@/config/labels";

export function HealthStatus() {
  return (
    <StoryMetric
      label={uiLabels.systemHealth}
      value="۹۸٪"
      numericValue={98}
      valueSuffix="٪"
      story="همه سرویس‌ها فعال هستند."
      trend={{ value: "فعال", positive: true }}
    />
  );
}
