"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spring, cardHover, cardTap } from "@/lib/motion";
import { CountUp } from "@/components/motion";
import { floatingMetrics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface FloatingMetricsProps {
  showConnections?: boolean;
}

export function FloatingMetrics({ showConnections = true }: FloatingMetricsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative h-[480px] w-full max-w-[640px] mx-auto">
      {/* Connection lines — visible on hover */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        aria-hidden="true"
      >
        {floatingMetrics.map((metric) => {
          const rad = (metric.angle * Math.PI) / 180;
          const cx = 320 + Math.cos(rad) * metric.distance;
          const cy = 240 + Math.sin(rad) * metric.distance;
          const isHovered = hoveredId === metric.id;

          return (
            <motion.line
              key={metric.id}
              x1="320"
              y1="240"
              x2={cx}
              y2={cy}
              stroke="var(--primary-muted)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered && showConnections ? 0.4 : 0 }}
              transition={spring.gentle}
            />
          );
        })}
      </svg>

      {/* Metric cards */}
      {floatingMetrics.map((metric, index) => {
        const rad = (metric.angle * Math.PI) / 180;
        const x = Math.cos(rad) * metric.distance;
        const y = Math.sin(rad) * metric.distance;

        return (
          <motion.div
            key={metric.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.2 + index * 0.08, ...spring.soft }}
            onHoverStart={() => setHoveredId(metric.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <motion.div
              whileHover={cardHover}
              className={cn(
                "w-[140px] rounded-[10px] border bg-bg-elevated p-3",
                "transition-colors duration-[120ms] cursor-default",
                hoveredId === metric.id
                  ? "border-border-hover shadow-[var(--shadow-md)]"
                  : "border-border"
              )}
            >
              <p className="text-[13px] text-text-tertiary">{metric.label}</p>
              <p className="mt-1 text-[24px] font-semibold text-text-primary leading-none tabular-nums">
                {"numeric" in metric && metric.numeric != null ? (
                  <CountUp value={metric.numeric} duration={0.9} />
                ) : (
                  metric.value
                )}
              </p>
              <p className="mt-2 text-[13px] text-text-secondary leading-snug">
                {metric.story}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
