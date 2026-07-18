"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { interactive, radius } from "@/lib/motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-[12px] font-medium text-text-tertiary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full border border-border bg-bg-elevated px-3.5 py-2.5",
            "text-[14px] text-text-primary placeholder:text-text-muted",
            "shadow-[var(--shadow-sm)]",
            "transition-[border-color,box-shadow] duration-[140ms]",
            "hover:border-border-strong",
            "focus:border-border-hover focus:shadow-[0_0_0_3px_var(--primary-soft)] focus:outline-none",
            radius.md,
            interactive.disabled,
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-[12px] font-medium text-text-tertiary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full resize-none border border-border bg-bg-elevated px-3.5 py-2.5",
            "text-[14px] text-text-primary placeholder:text-text-muted",
            "shadow-[var(--shadow-sm)]",
            "transition-[border-color,box-shadow] duration-[140ms]",
            "hover:border-border-strong",
            "focus:border-border-hover focus:shadow-[0_0_0_3px_var(--primary-soft)] focus:outline-none",
            radius.md,
            interactive.disabled,
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
