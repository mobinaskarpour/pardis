"use client";

import { motion } from "framer-motion";
import { spring, stagger, chartForm } from "@/lib/motion";
import { revenueData } from "@/lib/ai-workspace-data";
import { cn } from "@/lib/utils";

export function RevenueCanvas() {
  const maxTrend = Math.max(...revenueData.trend);

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
        <p className="text-[13px] font-medium text-text-tertiary">درآمد ماه جاری</p>
        <div className="mt-2 flex items-end gap-3">
          <span className="text-[40px] font-semibold leading-none text-text-primary">
            {revenueData.month}
          </span>
          <span
            className={cn(
              "mb-1 text-[13px] rounded-[6px] px-2 py-0.5",
              revenueData.change < 0
                ? "bg-error/10 text-error"
                : "bg-success/10 text-success"
            )}
          >
            {revenueData.change > 0 ? "+" : ""}
            {revenueData.change}٪ نسبت به ماه گذشته
          </span>
        </div>
        <p className="mt-2 text-[15px] text-text-secondary">
          درآمد امروز: {revenueData.today}
        </p>
      </motion.div>

      {/* Custom Activity River chart */}
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-6"
      >
        <p className="text-[13px] font-medium text-text-tertiary mb-6">
          روند فعالیت — ۷ روز اخیر
        </p>
        <div className="flex items-end justify-between gap-3 h-32">
          {revenueData.trend.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full rounded-[6px] bg-primary/20 relative overflow-hidden origin-bottom"
                style={{ height: `${(value / maxTrend) * 100}%`, minHeight: 8 }}
                initial={{ scaleY: 0.65, opacity: 0.5, filter: "blur(2px)" }}
                animate={{ scaleY: 1, opacity: 1, filter: "blur(0px)" }}
                transition={chartForm(0.15 + i * 0.08)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-primary/10" />
              </motion.div>
              <span className="text-[11px] text-text-tertiary">
                {["ش", "ی", "د", "س", "چ", "پ", "ج"][i]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Breakdown */}
      <motion.div
        variants={stagger.item}
        transition={spring.soft}
        className="rounded-[14px] border border-border bg-bg-elevated p-6"
      >
        <p className="text-[13px] font-medium text-text-tertiary mb-4">
          تفکیک درآمد
        </p>
        <div className="space-y-4">
          {revenueData.breakdown.map((item, bi) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[15px] text-text-primary">{item.label}</span>
                <span className="text-[15px] font-medium text-text-primary">
                  {item.amount}
                </span>
              </div>
              <div className="h-1 rounded-full bg-bg-subtle overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary/50 origin-right"
                  style={{ width: item.value }}
                  initial={{ scaleX: 0.7, opacity: 0.5 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={chartForm(0.35 + bi * 0.06)}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
