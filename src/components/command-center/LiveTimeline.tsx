"use client";

import { timelineEvents } from "@/lib/mock-data";
import { Timeline, Card } from "@/components/core";
import type { TimelineEvent } from "@/components/core";

const events: TimelineEvent[] = timelineEvents.map((e) => ({
  id: e.id,
  time: e.time,
  title: e.title,
  detail: e.detail,
  kind:
    e.type === "imaging"
      ? "imaging"
      : e.type === "doctor"
        ? "doctor"
        : e.type === "ai"
          ? "ai"
          : e.type === "patient"
            ? "patient"
            : "default",
}));

export function LiveTimeline() {
  return (
    <Card variant="timeline" padding="md" hover={false}>
      <Timeline events={events} live />
    </Card>
  );
}
