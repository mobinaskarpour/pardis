"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricTimelinePanelProps {
  events: { time: string; label: string }[];
}

export function MetricTimelinePanel({ events }: MetricTimelinePanelProps) {
  if (events.length === 0) return null;

  return (
    <div className="relative ps-1">
      <div className="absolute top-0 bottom-0 start-[11px] w-px bg-border" />
      <ul className="space-y-4">
        {events.map((ev, i) => (
          <li key={`${ev.time}-${ev.label}`} className="relative flex gap-3 ps-8">
            <div
              className={cn(
                "absolute start-0 flex h-6 w-6 items-center justify-center rounded-full border bg-bg-elevated",
                i === 0 ? "border-primary/30 text-primary" : "border-border text-text-muted"
              )}
            >
              {i === 0 ? (
                <CheckCircle2 size={12} strokeWidth={2} />
              ) : (
                <Clock3 size={12} strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0 pt-0.5">
              <time className="text-[11px] font-mono tabular-nums text-text-muted">
                {ev.time}
              </time>
              <p className="text-[13px] text-text-secondary leading-snug mt-0.5">
                {ev.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
