"use client";

import { motion } from "framer-motion";
import { toPersianDigits } from "@/lib/persian";
import { series } from "@/components/dashboard/charts/chart-tokens";
import { spring } from "@/lib/motion";

interface MetricBreakdownChartProps {
  items: { label: string; value: number }[];
  title?: string;
}

export function MetricBreakdownChart({
  items,
  title = "تفکیک",
}: MetricBreakdownChartProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div>
      <p className="text-[12px] font-medium text-text-muted mb-4">{title}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, ...spring.soft }}
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[13px] text-text-secondary truncate">
                {item.label}
              </span>
              <span className="text-[13px] font-semibold text-text-primary tabular-nums shrink-0">
                {toPersianDigits(item.value)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-bg-subtle overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: series[i % series.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / max) * 100}%` }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
