"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Option } from "@/config/workflow-options";

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="mb-1.5 block text-[12px] text-text-tertiary">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass = cn(
  "w-full rounded-[8px] border border-border bg-bg px-3 py-2",
  "text-[13px] text-text-primary placeholder:text-text-tertiary",
  "outline-none transition-colors duration-[120ms] focus:border-border-hover"
);

export function EditorInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function EditorTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      rows={2}
      {...props}
      className={cn(inputClass, "resize-none leading-relaxed", props.className)}
    />
  );
}

export function EditorSelect({
  value,
  options,
  onChange,
  className,
}: {
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <span className={cn("relative block", className)}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "appearance-none cursor-pointer pl-8")}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.75}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
      />
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex cursor-pointer items-center gap-2.5"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-[180ms]",
          checked ? "bg-success" : "bg-bg-subtle border border-border-strong"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-[180ms]",
            checked ? "right-[3px]" : "right-[23px]"
          )}
          style={{ width: 18, height: 18 }}
        />
      </span>
      {label && (
        <span className="text-[13px] font-medium text-text-secondary">
          {label}
        </span>
      )}
    </button>
  );
}
