"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { OperationalEvent } from "@/lib/operations-data";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface OperationalTimelineProps {
  events: OperationalEvent[];
}

const toneDot: Record<OperationalEvent["tone"], string> = {
  neutral: "bg-white/40",
  success: "bg-success",
  warning: "bg-warning",
  critical: "bg-error animate-pulse",
};

export function OperationalTimeline({ events }: OperationalTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute top-3 bottom-3 start-[7px] w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      <ul className="space-y-0">
        {events.map((ev, i) => (
          <motion.li
            key={ev.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, ...spring.soft }}
          >
            <Link
              href={`/workflows/${ev.workflowId}`}
              className="group flex gap-4 py-3.5 border-b border-border/40 last:border-0 hover:bg-bg-subtle/30 -mx-2 px-2 rounded-[12px] transition-colors"
            >
              <div className="relative z-10 mt-1.5 flex flex-col items-center gap-1 shrink-0">
                <span className={cn("h-2 w-2 rounded-full", toneDot[ev.tone])} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] font-mono tabular-nums text-text-muted shrink-0">
                    {ev.time}
                  </span>
                  <p className="text-[14px] font-medium text-text-primary leading-snug group-hover:text-primary transition-colors">
                    {ev.label}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-text-muted truncate">
                  {ev.workflowName}
                </p>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
