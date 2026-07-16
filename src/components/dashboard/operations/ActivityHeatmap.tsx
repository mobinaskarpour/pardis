"use client";

import { motion } from "framer-motion";

const DAY_LABELS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

interface ActivityHeatmapProps {
  grid: number[][];
}

export function ActivityHeatmap({ grid }: ActivityHeatmapProps) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="min-w-[520px]">
        <div className="flex gap-[3px] mb-2">
          {Array.from({ length: 24 }, (_, h) => (
            <span
              key={h}
              className="flex-1 text-center text-[8px] text-text-muted tabular-nums"
            >
              {h % 6 === 0 ? h : ""}
            </span>
          ))}
        </div>
        {grid.map((row, d) => (
          <div key={d} className="flex items-center gap-2 mb-[3px]">
            <span className="w-4 text-[9px] text-text-muted shrink-0">
              {DAY_LABELS[d]}
            </span>
            <div className="flex flex-1 gap-[3px]">
              {row.map((intensity, h) => (
                <motion.div
                  key={h}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: (d * 24 + h) * 0.002 }}
                  className="flex-1 h-3 rounded-[2px]"
                  style={{
                    background: `rgba(45, 90, 123, ${0.08 + intensity * 0.85})`,
                  }}
                  title={`${DAY_LABELS[d]} ${h}:00`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
