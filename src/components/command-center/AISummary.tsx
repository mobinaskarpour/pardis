"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { aiSummary } from "@/lib/mock-data";

export function AISummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.8, ...spring.soft }}
      className="max-w-2xl"
    >
      <p className="text-[28px] font-medium leading-relaxed text-text-primary">
        {aiSummary.greeting}
      </p>
      <div className="mt-4 space-y-1">
        {aiSummary.lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.15, ...spring.gentle }}
            className="text-[16px] text-text-secondary"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
