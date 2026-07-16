"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

interface WorkflowCanvasFlowProps {
  steps: string[];
}

export function WorkflowCanvasFlow({ steps }: WorkflowCanvasFlowProps) {
  return (
    <div className="overflow-x-auto rounded-[18px] border border-border/60 bg-gradient-to-b from-[#f8f9fb] to-white p-6 md:p-8">
      <div className="flex min-w-max items-start gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, ...spring.soft }}
              className="flex flex-col items-center w-[132px]"
            >
              <div
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-[16px] border-2 shadow-sm",
                  i === 0
                    ? "border-primary bg-primary text-white shadow-[0_4px_16px_rgba(45,90,123,0.3)]"
                    : i === steps.length - 1
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-border/70 bg-white text-text-secondary"
                )}
              >
                {i === steps.length - 1 ? (
                  <CheckCircle2 size={22} strokeWidth={1.75} />
                ) : (
                  <span className="text-[16px] font-bold">
                    {toPersianDigits(i + 1)}
                  </span>
                )}
              </div>
              <p className="mt-3 text-center text-[12px] font-semibold leading-snug text-text-primary px-1">
                {step}
              </p>
              <span className="mt-1 text-[10px] text-text-muted">
                {i === 0 ? "شروع" : i === steps.length - 1 ? "پایان" : "مرحله"}
              </span>
            </motion.div>

            {i < steps.length - 1 && (
              <div className="flex items-center px-1 pt-4">
                <svg width="48" height="24" viewBox="0 0 48 24" aria-hidden>
                  <path
                    d="M 0 12 C 16 12, 16 4, 24 4 S 32 20, 48 12"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeOpacity="0.35"
                    strokeLinecap="round"
                  />
                  <polygon
                    points="44,12 38,8 38,16"
                    fill="var(--primary)"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
        <p className="text-[11px] text-text-muted">
          {toPersianDigits(steps.length)} مرحله · اجرای خودکار
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
          <ArrowLeft size={12} />
          جهت جریان
        </span>
      </div>
    </div>
  );
}
