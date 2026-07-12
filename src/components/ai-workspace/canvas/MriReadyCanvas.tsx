"use client";

import { motion } from "framer-motion";
import { spring, stagger } from "@/lib/motion";
import { mriReady } from "@/lib/ai-workspace-data";
import { cn } from "@/lib/utils";

export function MriReadyCanvas() {
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
        <p className="text-[13px] font-medium text-text-tertiary">MRIهای آماده</p>
        <div className="mt-2 flex items-end gap-4">
          <span className="text-[40px] font-semibold leading-none text-text-primary">
            ۳
          </span>
          <p className="mb-1 text-[13px] text-warning">۱ مورد فوری</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mriReady.map((item, i) => (
          <motion.div
            key={item.id}
            variants={stagger.item}
            transition={{ ...spring.soft, delay: i * 0.08 }}
            whileHover={{ y: -2, transition: spring.gentle }}
            className={cn(
              "rounded-[14px] border bg-bg-elevated p-5 transition-colors duration-[120ms]",
              item.status === "آماده بررسی"
                ? "border-border-hover"
                : "border-border"
            )}
          >
            <div className="aspect-square rounded-[10px] bg-bg-subtle border border-border mb-4 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full border border-border-strong bg-gradient-to-br from-primary/5 to-accent-cyan/10" />
            </div>
            <p className="text-[15px] font-medium text-text-primary">
              {item.type}
            </p>
            <p className="text-[13px] text-text-tertiary mt-1">
              {item.patient} · پرونده {item.caseNumber}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-text-tertiary">
                {item.time} · {item.device}
              </span>
              <span
                className={cn(
                  "text-[13px] rounded-[6px] px-2 py-0.5",
                  item.status === "آماده بررسی"
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
                )}
              >
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
