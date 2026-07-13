"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

const hours = ["۸", "۹", "۱۰", "۱۱", "۱۲", "۱۳", "۱۴", "۱۵", "۱۶", "۱۷"];
const activityData = [3, 8, 14, 18, 12, 6, 15, 20, 16, 9];

export function ActivityRiver() {
  const max = Math.max(...activityData);

  return (
    <div className="rounded-[var(--radius-xl)] glass-subtle p-6">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-[var(--text-xs)] font-medium uppercase tracking-wider text-text-muted">
            Activity River
          </p>
          <p className="mt-1 text-[var(--text-body)] text-text-secondary">
            جریان فعالیت امروز
          </p>
        </div>
        <span className="text-[var(--text-sm)] text-text-tertiary">
          زنده
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mr-1.5 h-1.5 w-1.5 rounded-full bg-success align-middle"
          />
        </span>
      </div>

      <div className="relative h-32">
        <svg
          viewBox="0 0 400 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <motion.path
            d={buildPath(activityData, max, true)}
            fill="url(#riverGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Line */}
          <motion.path
            d={buildPath(activityData, max, false)}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Data points */}
          {activityData.map((val, i) => {
            const x = (i / (activityData.length - 1)) * 400;
            const y = 90 - (val / max) * 70;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="var(--primary)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ delay: 0.8 + i * 0.08, ...spring.gentle }}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-2 px-1">
        {hours.map((h) => (
          <span key={h} className="text-[11px] text-text-muted">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

function buildPath(data: number[], max: number, closed: boolean): string {
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 400;
    const y = 90 - (val / max) * 70;
    return { x, y };
  });

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  if (closed) {
    d += ` L 400 100 L 0 100 Z`;
  }

  return d;
}
