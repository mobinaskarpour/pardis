"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { spring } from "@/lib/motion";
import type { DashboardGeneration } from "@/types/ai";
import { cn } from "@/lib/utils";

interface DashboardGenerationCardProps {
  generation: DashboardGeneration;
}

export function DashboardGenerationCard({
  generation,
}: DashboardGenerationCardProps) {
  const isGenerating = generation.status === "generating";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="rounded-[16px] border border-primary/20 bg-gradient-to-l from-primary/[0.06] to-transparent p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/12">
          <LayoutDashboard size={17} className="text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-text-primary">
            {isGenerating
              ? "Workflow created successfully."
              : "Dashboard widgets are ready."}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {isGenerating
              ? "Dashboard widgets are now being generated..."
              : "ویجت‌ها به مرکز فرمان اضافه شدند."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {generation.widgets.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isGenerating ? i * 0.35 : i * 0.1, ...spring.soft }}
            className={cn(
              "rounded-[12px] border border-border/60 bg-white px-3 py-3",
              isGenerating && i === generation.widgets.length - 1 && "animate-pulse"
            )}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={11} className="text-primary/70" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide">
                Widget
              </span>
            </div>
            <p className="text-[12px] font-semibold text-text-primary">{name}</p>
            <div className="mt-2 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
              <motion.div
                className="h-full bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: isGenerating ? "60%" : "100%" }}
                transition={{ delay: i * 0.3, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
