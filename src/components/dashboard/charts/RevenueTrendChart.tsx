"use client";

import { useState } from "react";
import { toPersianDigits, formatPersianNumber } from "@/lib/persian";
import { monthlyRevenue } from "@/mock/data/dashboard";
import { series, chartInk } from "./chart-tokens";
import { ChartTooltip } from "./ChartTooltip";

const VIEW_W = 560;
const VIEW_H = 230;
const PAD = { top: 24, right: 48, bottom: 30, left: 44 };
const Y_MAX = 1400;
const Y_TICKS = [0, 350, 700, 1050, 1400];

export function RevenueTrendChart() {
  const [hover, setHover] = useState<number | null>(null);

  const plotW = VIEW_W - PAD.left - PAD.right;
  const plotH = VIEW_H - PAD.top - PAD.bottom;
  const n = monthlyRevenue.length;

  const xFor = (i: number) => PAD.left + (plotW * i) / (n - 1);
  const yFor = (v: number) => PAD.top + plotH * (1 - v / Y_MAX);

  const points = monthlyRevenue.map((d, i) => ({
    x: xFor(i),
    y: yFor(d.value),
  }));
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[n - 1].x},${PAD.top + plotH} L${points[0].x},${PAD.top + plotH} Z`;
  const last = monthlyRevenue[n - 1];

  const handleMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * plotW;
    const idx = Math.min(n - 1, Math.max(0, Math.round((px / plotW) * (n - 1))));
    setHover(idx);
  };

  return (
    <div dir="ltr" className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="نمودار روند درآمد ماهانه"
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
              {formatPersianNumber(t)}
            </text>
          </g>
        ))}

        {monthlyRevenue.map((d, i) => (
          <text
            key={d.label}
            x={xFor(i)}
            y={VIEW_H - 10}
            textAnchor="middle"
            fontSize={11}
            fill={chartInk.axis}
          >
            {d.label}
          </text>
        ))}

        <path d={areaPath} fill={series[0]} opacity={0.1} />
        <path
          d={linePath}
          fill="none"
          stroke={series[0]}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {hover !== null && (
          <line
            x1={points[hover].x}
            x2={points[hover].x}
            y1={PAD.top}
            y2={PAD.top + plotH}
            stroke={chartInk.grid}
            strokeWidth={1}
          />
        )}
        {hover !== null && (
          <circle
            cx={points[hover].x}
            cy={points[hover].y}
            r={4.5}
            fill={series[0]}
            stroke={chartInk.surface}
            strokeWidth={2}
          />
        )}

        {/* end marker + direct label for the latest month */}
        <circle
          cx={points[n - 1].x}
          cy={points[n - 1].y}
          r={4.5}
          fill={series[0]}
          stroke={chartInk.surface}
          strokeWidth={2}
        />
        <text
          x={points[n - 1].x + 8}
          y={points[n - 1].y + 4}
          fontSize={12}
          fontWeight={600}
          fill={chartInk.label}
        >
          {formatPersianNumber(last.value)}
        </text>

        <rect
          x={PAD.left}
          y={PAD.top}
          width={plotW}
          height={plotH}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {hover !== null && (
        <ChartTooltip
          xPct={(points[hover].x / VIEW_W) * 100}
          yPct={(points[hover].y / VIEW_H) * 100}
          title={monthlyRevenue[hover].label}
          value={`${formatPersianNumber(monthlyRevenue[hover].value)} میلیون تومان`}
        />
      )}

      <p dir="rtl" className="mt-1 text-[11px] text-text-tertiary">
        ارقام به میلیون تومان — {toPersianDigits(6)} ماه اخیر
      </p>
    </div>
  );
}
