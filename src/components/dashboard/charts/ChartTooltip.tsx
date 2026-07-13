"use client";

interface ChartTooltipProps {
  /** Position as percentage of the chart container */
  xPct: number;
  yPct: number;
  title: string;
  value: string;
}

export function ChartTooltip({ xPct, yPct, title, value }: ChartTooltipProps) {
  return (
    <div
      dir="rtl"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-[10px] border border-border bg-bg-elevated px-3 py-2 shadow-md whitespace-nowrap"
      style={{ left: `${xPct}%`, top: `${yPct}%`, marginTop: -8 }}
    >
      <p className="text-[13px] text-text-tertiary">{title}</p>
      <p className="text-[13px] font-semibold text-text-primary">{value}</p>
    </div>
  );
}
