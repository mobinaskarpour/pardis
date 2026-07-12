"use client";

import { motion } from "framer-motion";
import {
  User,
  Stethoscope,
  GitBranch,
  Sparkles,
  Wallet,
  Scan,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

export type TimelineKind =
  | "patient"
  | "doctor"
  | "workflow"
  | "ai"
  | "financial"
  | "imaging"
  | "default";

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  detail?: string;
  kind?: TimelineKind;
}

const kindConfig: Record<TimelineKind, { color: string; Icon: LucideIcon }> = {
  patient: { color: "bg-success", Icon: User },
  doctor: { color: "bg-primary", Icon: Stethoscope },
  workflow: { color: "bg-accent-indigo", Icon: GitBranch },
  ai: { color: "bg-accent-indigo", Icon: Sparkles },
  financial: { color: "bg-warning", Icon: Wallet },
  imaging: { color: "bg-accent-cyan", Icon: Scan },
  default: { color: "bg-text-tertiary", Icon: Sparkles },
};

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
  live?: boolean;
}

export function Timeline({ events, className, live }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {live && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-tertiary">Timeline</span>
          <span className="flex items-center gap-1 text-[13px] text-success">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-success"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Live
          </span>
        </div>
      )}

      <div className="absolute top-2 bottom-2 right-[11px] w-px bg-border-strong" />

      <div className="space-y-0">
        {events.map((event, i) => {
          const kind = event.kind ?? "default";
          const { color, Icon } = kindConfig[kind];

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.08 + i * 0.08, ...spring.gentle }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg-elevated bg-bg-elevated">
                <span className={cn("absolute inset-0 rounded-full opacity-20", color)} />
                <Icon size={10} strokeWidth={2} className="relative text-text-secondary" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[13px] text-text-tertiary tabular-nums">{event.time}</p>
                <p className="mt-0.5 text-[15px] font-medium text-text-primary">
                  {event.title}
                </p>
                {event.detail && (
                  <p className="mt-0.5 text-[13px] text-text-secondary">{event.detail}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
