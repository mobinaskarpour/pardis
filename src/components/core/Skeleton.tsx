"use client";

import { cn } from "@/lib/utils";
import { radius } from "@/lib/motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle" | "chart";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const base = cn(
    "relative overflow-hidden bg-bg-subtle",
    radius.md,
    "before:absolute before:inset-0 before:-translate-x-full",
    "before:animate-[shimmer_2s_ease-in-out_infinite]",
    "before:bg-gradient-to-r before:from-transparent before:via-bg-elevated/60 before:to-transparent",
    className
  );

  if (variant === "circle") {
    return <div className={cn(base, "rounded-full")} />;
  }

  if (variant === "card") {
    return <div className={cn(base, radius.lg, "h-32 w-full")} />;
  }

  if (variant === "chart") {
    return (
      <div className={cn(base, radius.lg, "h-48 w-full flex items-end gap-2 p-4")}>
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-[6px] bg-bg-elevated/40"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }

  return <div className={cn(base, "h-4 w-full")} />;
}

interface SkeletonGroupProps {
  lines?: number;
  className?: string;
}

export function SkeletonGroup({ lines = 3, className }: SkeletonGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}
