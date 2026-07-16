"use client";

import { motion } from "framer-motion";
import { toPersianDigits } from "@/lib/persian";
import { spring } from "@/lib/motion";

const HOUR_LABELS = ["۸", "۱۰", "۱۲", "۱۴", "۱۶", "۱۸", "۲۰", "۲۲"];

interface MetricHeatmapPanelProps {
  cells: number[];
  title?: string;
}

export function MetricHeatmapPanel({ cells, title = "توزیع ساعتی" }: MetricHeatmapPanelProps) {
  const max = Math.max(...cells, 0.01);

  return (
    <div>
      <p className="text-[12px] font-medium text-text-muted mb-4">{title}</p>
      <div className="flex gap-1.5">
        {cells.map((intensity, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, ...spring.soft }}
            className="flex flex-1 flex-col items-center gap-2 origin-bottom"
          >
            <div
              className="w-full rounded-[6px] transition-colors"
              style={{
                height: `${48 + intensity * 40}px`,
                background: `color-mix(in srgb, var(--primary) ${Math.round(20 + (intensity / max) * 70)}%, transparent)`,
              }}
            />
            <span className="text-[10px] text-text-muted tabular-nums">
              {HOUR_LABELS[i] ?? toPersianDigits(i + 8)}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-text-muted">
        <span>کم</span>
        <div className="flex gap-0.5">
          {[0.2, 0.4, 0.6, 0.8, 1].map((v) => (
            <div
              key={v}
              className="h-2 w-4 rounded-[2px]"
              style={{
                background: `color-mix(in srgb, var(--primary) ${Math.round(20 + v * 70)}%, transparent)`,
              }}
            />
          ))}
        </div>
        <span>زیاد</span>
      </div>
    </div>
  );
}
