"use client";

import { motion } from "framer-motion";
import { Scan, Stethoscope, Bell, Sparkles, User, FileText } from "lucide-react";
import { timelineEvents } from "@/lib/mock-data";
import { spring, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const typeIcons = {
  imaging: Scan,
  doctor: Stethoscope,
  notification: Bell,
  ai: Sparkles,
  patient: User,
  report: FileText,
};

const typeColors = {
  imaging: "text-accent-cyan bg-accent-cyan/10",
  doctor: "text-primary bg-primary/10",
  notification: "text-accent-warm bg-accent-warm/10",
  ai: "text-accent-indigo bg-accent-indigo/10",
  patient: "text-success bg-success/10",
  report: "text-text-secondary bg-bg-subtle",
};

interface JourneyTimelineProps {
  filter?: string | null;
  compact?: boolean;
}

export function JourneyTimeline({ filter, compact }: JourneyTimelineProps) {
  const events = filter
    ? timelineEvents.filter(
        (e) =>
          e.title.includes(filter) ||
          e.detail.includes(filter) ||
          e.type === filter
      )
    : timelineEvents;

  const displayEvents = compact ? events.slice(0, 4) : events;

  return (
    <div className="rounded-[var(--radius-xl)] glass-subtle p-6">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider text-text-muted">
            Live Timeline
          </p>
          <p className="mt-1 text-[var(--text-body)] text-text-secondary">
            {filter ? `فیلتر: ${filter}` : "رویدادهای زنده"}
          </p>
        </div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[var(--text-xs)] text-text-muted"
        >
          اکنون
        </motion.span>
      </div>

      <motion.div
        variants={stagger.timeline}
        initial="initial"
        animate="animate"
        className="relative space-y-0"
      >
        <div className="absolute top-2 bottom-2 right-[19px] w-px bg-border-strong" />

        {displayEvents.map((event, i) => {
          const Icon = typeIcons[event.type];
          const colorClass = typeColors[event.type];

          return (
            <motion.div
              key={event.id}
              variants={stagger.item}
              transition={{ ...spring.soft, delay: i * 0.05 }}
              className="relative flex gap-4 py-3 group"
            >
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] overflow-hidden",
                  !event.imageUrl && colorClass
                )}
              >
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Icon size={16} strokeWidth={1.75} />
                )}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-baseline gap-2">
                  <p className="text-[var(--text-body)] font-medium text-text-primary">
                    {event.title}
                  </p>
                  <span className="text-[var(--text-xs)] text-text-muted tabular-nums">
                    {event.time}
                  </span>
                </div>
                <p className="mt-0.5 text-[var(--text-sm)] text-text-tertiary">
                  {event.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
