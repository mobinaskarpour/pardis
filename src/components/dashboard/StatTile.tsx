"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/core";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/mock/data/dashboard";

export function StatTile({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon;

  return (
    <Card hover={false} padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-text-tertiary">{stat.label}</p>
          <p className="mt-2 text-[28px] font-semibold leading-none text-text-primary">
            {stat.value}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-primary">
          <Icon size={18} strokeWidth={1.75} />
        </span>
      </div>
      {stat.delta && (
        <p
          className={cn(
            "mt-3 flex items-center gap-1.5 text-[12px]",
            stat.deltaUp === true && "text-success",
            stat.deltaUp === false && "text-error",
            stat.deltaUp === undefined && "text-text-tertiary"
          )}
        >
          {stat.deltaUp === true && <TrendingUp size={14} strokeWidth={1.75} />}
          {stat.deltaUp === false && (
            <TrendingDown size={14} strokeWidth={1.75} />
          )}
          {stat.delta}
        </p>
      )}
    </Card>
  );
}
