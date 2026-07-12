"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, interactive, radius } from "@/lib/motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-[13px] font-medium text-text-tertiary">
            {label}
          </label>
        )}
        <motion.div whileFocus={{ scale: 1.005, transition: spring.gentle }}>
          <input
            ref={ref}
            className={cn(
              "w-full border border-border bg-bg-elevated px-4 py-2.5",
              "text-[15px] text-text-primary placeholder:text-text-tertiary",
              "transition-[border-color,box-shadow] duration-[180ms]",
              "focus:border-border-hover focus:shadow-[0_0_0_3px_var(--primary-soft)] focus:outline-none",
              radius.md,
              interactive.disabled,
              className
            )}
            {...props}
          />
        </motion.div>
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
          <label className="mb-1.5 block text-[13px] font-medium text-text-tertiary">
            {label}
          </label>
        )}
        <motion.div whileFocus={{ scale: 1.005, transition: spring.gentle }}>
          <textarea
            ref={ref}
            className={cn(
              "w-full resize-none border border-border bg-bg-elevated px-4 py-2.5",
              "text-[15px] text-text-primary placeholder:text-text-tertiary",
              "transition-[border-color,box-shadow] duration-[180ms]",
              "focus:border-border-hover focus:shadow-[0_0_0_3px_var(--primary-soft)] focus:outline-none",
              radius.md,
              interactive.disabled,
              className
            )}
            {...props}
          />
        </motion.div>
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
