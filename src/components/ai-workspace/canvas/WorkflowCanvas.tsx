"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";
import { ArrowDown, Circle } from "lucide-react";

const workflowSteps = [
  { id: "1", label: "ثبت MRI", status: "done" },
  { id: "2", label: "بررسی پزشک", status: "active" },
  { id: "3", label: "تأیید گزارش", status: "pending" },
  { id: "4", label: "اطلاع‌رسانی بیمار", status: "pending" },
];

export function WorkflowCanvas() {
  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-6"
      >
        <p className="text-[13px] font-medium text-text-tertiary">Workflow</p>
        <h2 className="mt-1 text-[28px] font-semibold text-text-primary">
          پیگیری MRI
        </h2>
        <p className="mt-2 text-[15px] text-text-secondary">
          ۴ مرحله · ۲ مرحله فعال · پیشنهاد AI
        </p>
      </motion.div>

      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-8"
      >
        <div className="flex flex-col items-center gap-2">
          {workflowSteps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, ...spring.soft }}
                className={`flex items-center gap-3 rounded-[10px] border px-5 py-3 min-w-[200px] ${
                  step.status === "active"
                    ? "border-primary/30 bg-primary/5"
                    : step.status === "done"
                      ? "border-success/30 bg-success/5"
                      : "border-border bg-bg-subtle/50"
                }`}
              >
                <Circle
                  size={16}
                  strokeWidth={1.75}
                  className={
                    step.status === "done"
                      ? "text-success fill-success/20"
                      : step.status === "active"
                        ? "text-primary fill-primary/20"
                        : "text-text-tertiary"
                  }
                />
                <span className="text-[15px] text-text-primary">{step.label}</span>
              </motion.div>
              {i < workflowSteps.length - 1 && (
                <ArrowDown
                  size={16}
                  strokeWidth={1.75}
                  className="my-1 text-text-tertiary opacity-40"
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
