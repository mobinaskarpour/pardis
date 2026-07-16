"use client";

import { quickCommands } from "@/mock/data/chat-experience";
import { cn } from "@/lib/utils";

interface QuickCommandsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export function QuickCommands({ onSelect, disabled }: QuickCommandsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
      {quickCommands.map((cmd) => (
        <button
          key={cmd.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(cmd.query)}
          className={cn(
            "rounded-[8px] px-2.5 py-1 text-[11px] font-mono font-medium",
            "text-text-muted border border-transparent",
            "hover:text-primary hover:bg-primary/8 hover:border-primary/15",
            "transition-colors disabled:opacity-40"
          )}
          title={cmd.label}
        >
          {cmd.command}
        </button>
      ))}
    </div>
  );
}
