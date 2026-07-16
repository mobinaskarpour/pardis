"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";

interface HealthItem {
  id: string;
  name: string;
  score: number;
  automation: number;
  status: string;
}

function RadialRing({
  value,
  size = 72,
  stroke = 4,
  color = "var(--primary)",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bg-subtle)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RadialHealthGrid({ items }: { items: HealthItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, ...spring.soft }}
        >
          <Link href={`/workflows/${item.id}`} className="group block">
            <div className="relative flex justify-center">
              <RadialRing
                value={item.score}
                color={
                  item.status === "warning"
                    ? "var(--warning)"
                    : item.status === "active"
                      ? "var(--success)"
                      : "var(--text-muted)"
                }
              />
              <span className="absolute inset-0 flex items-center justify-center text-[16px] font-bold text-text-primary tabular-nums">
                {toPersianDigits(item.score)}
              </span>
            </div>
            <p className="mt-3 text-center text-[12px] font-semibold text-text-secondary group-hover:text-primary line-clamp-2 leading-snug transition-colors">
              {item.name}
            </p>
            <p className="text-center text-[10px] text-text-muted mt-0.5">
              Auto {toPersianDigits(item.automation)}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
