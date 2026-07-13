"use client";

import { useState } from "react";
import { formatPersianNumber, toPersianDigits } from "@/lib/persian";
import { modalityShare } from "@/mock/data/dashboard";
import { series } from "./chart-tokens";

const SIZE = 200;
const R_OUTER = 88;
const R_INNER = 58;
/** 2px surface gap at the outer radius */
const PAD_ANGLE = 2 / R_OUTER;

function arcPath(start: number, end: number) {
  const c = SIZE / 2;
  const large = end - start > Math.PI ? 1 : 0;
  const pt = (r: number, a: number) =>
    `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
  return [
    `M${pt(R_OUTER, start)}`,
    `A${R_OUTER},${R_OUTER} 0 ${large} 1 ${pt(R_OUTER, end)}`,
    `L${pt(R_INNER, end)}`,
    `A${R_INNER},${R_INNER} 0 ${large} 0 ${pt(R_INNER, start)}`,
    "Z",
  ].join(" ");
}

const total = modalityShare.reduce((s, d) => s + d.value, 0);

const segments = modalityShare.map((d, i) => {
  const before = modalityShare
    .slice(0, i)
    .reduce((s, prev) => s + prev.value, 0);
  const start = -Math.PI / 2 + (before / total) * Math.PI * 2;
  const sweep = (d.value / total) * Math.PI * 2;
  return {
    ...d,
    color: series[i],
    path: arcPath(start + PAD_ANGLE / 2, start + sweep - PAD_ANGLE / 2),
    pct: Math.round((d.value / total) * 100),
  };
});

export function ModalityDonut() {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover !== null ? segments[hover] : null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div dir="ltr" className="relative shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label="سهم روش‌های تصویربرداری"
        >
          {segments.map((s, i) => (
            <path
              key={s.id}
              d={s.path}
              fill={s.color}
              opacity={hover === null || hover === i ? 1 : 0.4}
              style={{ transition: "opacity 120ms", cursor: "default" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-semibold text-text-primary leading-none">
            {active ? formatPersianNumber(active.value) : formatPersianNumber(total)}
          </span>
          <span className="mt-1.5 text-[12px] text-text-tertiary">
            {active ? active.label : "اسکن این ماه"}
          </span>
        </div>
      </div>

      <ul className="min-w-[170px] space-y-2.5">
        {segments.map((s, i) => (
          <li
            key={s.id}
            className="flex items-center gap-2.5"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="flex-1 text-[13px] text-text-secondary">
              {s.label}
            </span>
            <span className="text-[13px] font-medium text-text-primary">
              {formatPersianNumber(s.value)}
            </span>
            <span className="w-9 text-left text-[12px] text-text-tertiary">
              {toPersianDigits(s.pct)}٪
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
