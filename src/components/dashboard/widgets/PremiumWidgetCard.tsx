"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import { spring } from "@/lib/motion";
import type { HeroDashboardCard } from "@/types/dashboard";
import { cn } from "@/lib/utils";

function CardSparkline({
  id,
  points,
  positive,
}: {
  id: string;
  points: number[];
  positive?: boolean;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 320;
  const h = 56;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 6 - ((p - min) / range) * (h - 12);
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive !== false ? "#2d5a7b" : "#c47070";
  const fillCoords = `0,${h} ${coords} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-x-0 bottom-0 h-14 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillCoords} fill={`url(#${id})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

interface PremiumWidgetCardProps {
  card: HeroDashboardCard;
  index: number;
}

export function PremiumWidgetCard({ card, index }: PremiumWidgetCardProps) {
  const href = `/analytics/${encodeURIComponent(card.metricId)}`;
  const isUp = card.trendUp !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.05, ...spring.soft }}
    >
      <Link
        href={href}
        className={cn(
          "group relative flex h-[248px] flex-col overflow-hidden rounded-[18px]",
          "border border-border/60 bg-white p-5 pb-0",
          "shadow-[0_2px_8px_rgba(17,19,24,0.04)]",
          "transition-all duration-300",
          "hover:border-primary/25 hover:shadow-[0_12px_40px_rgba(45,90,123,0.12)] hover:-translate-y-1"
        )}
      >
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            {card.domainLabel}
          </span>
          {card.status === "suggested" ? (
            <span className="inline-flex items-center gap-1 rounded-[7px] bg-accent-indigo/10 px-2 py-0.5 text-[10px] font-bold text-accent-indigo">
              <Sparkles size={10} />
              پیشنهادی
            </span>
          ) : (
            <span className="rounded-[7px] bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
              آماده
            </span>
          )}
        </div>

        <h3 className="relative z-10 mt-2 text-[15px] font-semibold leading-snug text-text-primary line-clamp-2">
          {card.title}
        </h3>

        <p className="relative z-10 mt-3 text-[36px] font-bold leading-none tracking-tight text-text-primary">
          {card.value}
        </p>

        {card.trendDescription && (
          <p className="relative z-10 mt-2.5 flex items-center gap-1.5 text-[12px] text-text-tertiary">
            {isUp ? (
              <ArrowUp size={13} className="text-success shrink-0" strokeWidth={2.5} />
            ) : (
              <ArrowDown size={13} className="text-error shrink-0" strokeWidth={2.5} />
            )}
            {card.trendDescription}
          </p>
        )}

        <p className="relative z-10 mt-auto pb-3 text-[10px] font-medium text-text-muted/90">
          {card.footerLabel}
        </p>

        <div className="pointer-events-none opacity-70 transition-opacity duration-300 group-hover:opacity-100">
          <CardSparkline
            id={`spark-${card.metricId}`}
            points={card.sparkline}
            positive={card.trendUp !== false}
          />
        </div>
      </Link>
    </motion.div>
  );
}
