"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { integrations } from "@/lib/mock-data";

export function IntegrationsStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 2.3, ...spring.soft }}
      className="rounded-[14px] border border-border bg-bg-elevated p-5"
    >
      <p className="text-[13px] font-medium text-text-tertiary mb-4">
        یکپارچه‌سازی‌ها
      </p>

      <div className="space-y-3">
        {integrations.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4 + i * 0.05, ...spring.gentle }}
            className="flex items-center justify-between"
          >
            <span className="text-[15px] text-text-primary">{item.name}</span>
            <span className="flex items-center gap-1.5 text-[13px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Connected
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
