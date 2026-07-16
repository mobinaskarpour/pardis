"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";

interface ProcessExecutionMapProps {
  steps: string[];
  activeStep?: number;
}

export function ProcessExecutionMap({
  steps,
  activeStep = 0,
}: ProcessExecutionMapProps) {
  const n = steps.length;
  const pathD = steps
    .map((_, i) => {
      const x = 40 + (i / Math.max(n - 1, 1)) * 520;
      const y = 80 + Math.sin(i * 1.2) * 40;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0d1117] to-[#161b22] p-8 md:p-10 min-h-[320px]">
      <svg viewBox="0 0 600 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {steps.map((step, i) => {
          const x = 40 + (i / Math.max(n - 1, 1)) * 520;
          const y = 80 + Math.sin(i * 1.2) * 40;
          const active = i <= activeStep;
          return (
            <g key={step}>
              <motion.circle
                cx={x}
                cy={y}
                r={active ? 10 : 7}
                fill={active ? "var(--accent-cyan)" : "#ffffff20"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 * i, ...spring.soft }}
              />
              {active && i === activeStep && (
                <circle cx={x} cy={y} r={16} fill="none" stroke="var(--accent-cyan)" strokeOpacity="0.4">
                  <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <text
                x={x}
                y={y + 36}
                textAnchor="middle"
                className="fill-white/70 text-[11px] font-medium"
                style={{ fontFamily: "inherit" }}
              >
                {step.length > 14 ? `${step.slice(0, 12)}…` : step}
              </text>
              <text
                x={x}
                y={y - 20}
                textAnchor="middle"
                className="fill-white/30 text-[9px] font-mono"
              >
                {toPersianDigits(i + 1)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="absolute bottom-5 start-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
        Process Execution Map
      </p>
    </div>
  );
}
