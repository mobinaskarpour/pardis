"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toPersianDigits } from "@/lib/persian";
import { series, chartInk } from "@/components/dashboard/charts/chart-tokens";
import { ChartTooltip } from "@/components/dashboard/charts/ChartTooltip";

const VIEW_W = 640;
const VIEW_H = 220;
const PAD = { top: 20, right: 16, bottom: 36, left: 44 };

const DAY_LABELS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

interface MetricTimeSeriesChartProps {
  points: number[];
  labels?: string[];
  unit?: string;
}

export function MetricTimeSeriesChart({
  points,
  labels,
  unit = "",
}: MetricTimeSeriesChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const plotW = VIEW_W - PAD.left - PAD.right;
  const plotH = VIEW_H - PAD.top - PAD.bottom;

  const { yMax, yTicks, xLabels } = useMemo(() => {
    const max = Math.max(...points, 1);
    const padded = Math.ceil(max * 1.15);
    const step = padded <= 10 ? 2 : padded <= 50 ? 10 : padded <= 100 ? 20 : Math.ceil(padded / 5);
    const yMaxVal = Math.ceil(padded / step) * step;
    const ticks: number[] = [];
    for (let t = 0; t <= yMaxVal; t += step) ticks.push(t);

    const defaultLabels =
      points.length <= 7
        ? DAY_LABELS.slice(0, points.length)
        : points.map((_, i) => toPersianDigits(i + 1));

    return {
      yMax: yMaxVal,
      yTicks: ticks,
      xLabels: labels ?? defaultLabels,
    };
  }, [points, labels]);

  const yFor = (v: number) => PAD.top + plotH * (1 - v / yMax);
  const band = plotW / Math.max(points.length - 1, 1);

  const lineCoords = points
    .map((p, i) => {
      const x = PAD.left + band * i;
      const y = yFor(p);
      return `${x},${y}`;
    })
    .join(" ");

  const areaCoords = `${PAD.left},${PAD.top + plotH} ${lineCoords} ${PAD.left + band * (points.length - 1)},${PAD.top + plotH}`;

  return (
    <div dir="ltr" className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="نمودار سری زمانی"
      >
        <defs>
          <linearGradient id="metric-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series[0]} stopOpacity="0.22" />
            <stop offset="100%" stopColor={series[0]} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={VIEW_W - PAD.right}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke={chartInk.grid}
              strokeWidth={1}
              strokeDasharray={t === 0 ? undefined : "4 4"}
            />
            <text
              x={PAD.left - 10}
              y={yFor(t) + 4}
              textAnchor="end"
              fontSize={11}
              fill={chartInk.axis}
            >
              {toPersianDigits(t)}
            </text>
          </g>
        ))}

        <polygon points={areaCoords} fill="url(#metric-area)" />

        <motion.polyline
          fill="none"
          stroke={series[0]}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={lineCoords}
        />

        {points.map((p, i) => {
          const cx = PAD.left + band * i;
          const cy = yFor(p);
          const active = hover === null || hover === i;
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={hover === i ? 5 : 3.5}
                fill={series[0]}
                opacity={active ? 1 : 0.35}
                style={{ transition: "opacity 120ms, r 120ms" }}
              />
              {hover === i && (
                <circle cx={cx} cy={cy} r={9} fill={series[0]} opacity={0.15} />
              )}
              <text
                x={cx}
                y={VIEW_H - 12}
                textAnchor="middle"
                fontSize={10}
                fill={chartInk.axis}
              >
                {xLabels[i]}
              </text>
              <rect
                x={cx - band / 2}
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
          xPct={((PAD.left + band * hover) / VIEW_W) * 100}
          yPct={(yFor(points[hover]!) / VIEW_H) * 100}
          title={xLabels[hover] ?? ""}
          value={`${toPersianDigits(points[hover]!)}${unit ? ` ${unit}` : ""}`}
        />
      )}
    </div>
  );
}
