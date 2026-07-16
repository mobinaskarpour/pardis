"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { HeroDashboardCard } from "@/types/dashboard";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

interface MetricStreamProps {
  metrics: HeroDashboardCard[];
}

export function MetricStream({ metrics }: MetricStreamProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
      {metrics.map((m, i) => (
        <motion.div
          key={m.metricId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, ...spring.soft }}
          className="snap-start shrink-0"
        >
          <Link
            href={`/analytics/${encodeURIComponent(m.metricId)}`}
            className={cn(
              "group flex flex-col justify-between w-[200px] h-[120px] p-4",
              "rounded-[16px] border border-border/50 bg-white/80",
              "hover:border-primary/30 hover:bg-white transition-all duration-300",
              "hover:shadow-[0_8px_32px_rgba(45,90,123,0.08)]"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {m.domainLabel}
              </span>
              <ArrowUpRight
                size={14}
                className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </div>
            <div>
              <p className="text-[28px] font-bold leading-none text-text-primary tabular-nums tracking-tight">
                {toPersianDigits(m.value)}
              </p>
              <p className="mt-1 text-[11px] text-text-tertiary line-clamp-1">
                {m.title}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

interface AIInsightBlockProps {
  insight: string;
}

export function AIInsightBlock({ insight }: AIInsightBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="relative overflow-hidden rounded-[24px] bg-[#111318] p-8 md:p-10"
    >
      <div
        className="absolute -top-24 -end-24 h-64 w-64 rounded-full bg-primary/20 blur-[80px]"
        aria-hidden
      />
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-accent-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              THE MACHINE · Insight
            </span>
          </div>
          <p className="text-[20px] md:text-[24px] font-medium leading-[1.45] text-white/95">
            {insight}
          </p>
        </div>
        <Link
          href="/chat"
          className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white/80 hover:bg-white/10 transition-colors"
        >
          پرسیدن از AI
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
