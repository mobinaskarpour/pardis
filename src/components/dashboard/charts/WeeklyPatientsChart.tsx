"use client";

import { useState } from "react";
import { toPersianDigits } from "@/lib/persian";
import { weeklyPatients } from "@/mock/data/dashboard";
import { series, chartInk } from "./chart-tokens";
import { ChartTooltip } from "./ChartTooltip";

const VIEW_W = 560;
const VIEW_H = 230;
const PAD = { top: 24, right: 12, bottom: 30, left: 36 };
const Y_MAX = 50;
const Y_TICKS = [0, 10, 20, 30, 40, 50];
const BAR_W = 24;

/** Bar with a 4px rounded data-end, square at the baseline */
function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, h);
  return [
    `M${x},${y + h}`,
    `V${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `H${x + w - r}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
    `V${y + h}`,
    "Z",
  ].join(" ");
}

export function WeeklyPatientsChart() {
  const [hover, setHover] = useState<number | null>(null);

  const plotW = VIEW_W - PAD.left - PAD.right;
  const plotH = VIEW_H - PAD.top - PAD.bottom;
  const band = plotW / weeklyPatients.length;
  const maxIdx = weeklyPatients.reduce(
    (best, d, i) => (d.value > weeklyPatients[best].value ? i : best),
    0
  );

  const yFor = (v: number) => PAD.top + plotH * (1 - v / Y_MAX);

  return (
    <div dir="ltr" className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="نمودار بیماران هفته اخیر"
      >
        {Y_TICKS.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={VIEW_W - PAD.right}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke={chartInk.grid}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={yFor(t) + 4}
              textAnchor="end"
              fontSize={11}
              fill={chartInk.axis}
            >
              {toPersianDigits(t)}
            </text>
          </g>
        ))}

        {weeklyPatients.map((d, i) => {
          const cx = PAD.left + band * i + band / 2;
          const x = cx - BAR_W / 2;
          const y = yFor(d.value);
          const h = PAD.top + plotH - y;
          return (
            <g key={d.label}>
              <path
                d={barPath(x, y, BAR_W, h)}
                fill={series[0]}
                opacity={hover === null || hover === i ? 1 : 0.45}
                style={{ transition: "opacity 120ms" }}
              />
              {i === maxIdx && (
                <text
                  x={cx}
                  y={y - 7}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={600}
                  fill={chartInk.label}
                >
                  {toPersianDigits(d.value)}
                </text>
              )}
              <text
                x={cx}
                y={VIEW_H - 10}
                textAnchor="middle"
                fontSize={11}
                fill={chartInk.axis}
              >
                {d.label}
              </text>
              {/* hit target wider than the mark */}
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <ChartTooltip
          xPct={((PAD.left + band * hover + band / 2) / VIEW_W) * 100}
          yPct={(yFor(weeklyPatients[hover].value) / VIEW_H) * 100}
          title={weeklyPatients[hover].label}
          value={`${toPersianDigits(weeklyPatients[hover].value)} بیمار`}
        />
      )}
    </div>
  );
}
