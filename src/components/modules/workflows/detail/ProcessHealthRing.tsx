"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

interface ProcessHealthRingProps {
  score: number;
  automation: number;
  successRate: number;
  status: "active" | "warning" | "error" | "paused";
}

export function ProcessHealthRing({
  score,
  automation,
  successRate,
  status,
}: ProcessHealthRingProps) {
  const size = 160;
  const r = 68;
  const c = 2 * Math.PI * r;
  const offset = c - (automation / 100) * c;
  const color =
    status === "warning"
      ? "var(--warning)"
      : status === "error"
        ? "var(--error)"
        : "var(--primary)";

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={80} cy={80} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth="6" />
        <motion.circle
          cx={80}
          cy={80}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <motion.circle
          cx={80}
          cy={80}
          r={r - 14}
          fill="none"
          stroke="var(--success)"
          strokeWidth="3"
          strokeOpacity="0.5"
          strokeDasharray={c - 88}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (successRate / 100) * (c - 88) }}
          transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[42px] font-bold tracking-tighter text-white tabular-nums leading-none">
          {toPersianDigits(automation)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">
          Automation
        </span>
      </div>
      <div className="mt-4 flex gap-6 text-center">
        <div>
          <p className="text-[18px] font-bold text-white/90 tabular-nums">
            {toPersianDigits(successRate)}٪
          </p>
          <p className="text-[10px] text-white/35">موفقیت</p>
        </div>
        <div>
          <p className="text-[18px] font-bold text-white/90 tabular-nums">
            {toPersianDigits(score)}
          </p>
          <p className="text-[10px] text-white/35">امتیاز</p>
        </div>
      </div>
    </div>
  );
}
