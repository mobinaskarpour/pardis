"use client";

import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryContextChipProps {
  text: string;
  className?: string;
}

export function MemoryContextChip({ text, className }: MemoryContextChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        "border border-accent-indigo/15 bg-accent-indigo/[0.06]",
        "px-3 py-1 text-[11px] font-medium text-accent-indigo",
        className
      )}
    >
      <Brain size={12} strokeWidth={1.75} />
      {text}
    </div>
  );
}
