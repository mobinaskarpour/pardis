"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ExecutionNode } from "@/lib/operations-data";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ExecutionMapProps {
  nodes: ExecutionNode[];
}

export function ExecutionMap({ nodes }: ExecutionMapProps) {
  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-[24px] bg-[#0a0c10]">
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          if (!next) return null;
          return (
            <motion.line
              key={`${node.id}-${next.id}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="var(--accent-cyan)"
              strokeWidth="1"
              strokeOpacity="0.35"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.1, duration: 1 }}
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 * i, ...spring.soft }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <Link href={`/workflows/${node.workflowId}`} className="group block">
            <div
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-transform group-hover:scale-110",
                node.status === "flowing" && "border-accent-cyan/60 bg-accent-cyan/10",
                node.status === "alert" && "border-warning/70 bg-warning/10",
                node.status === "idle" && "border-white/20 bg-white/5"
              )}
            >
              {node.status === "flowing" && (
                <span className="absolute inset-0 rounded-full bg-accent-cyan/20 animate-ping" />
              )}
              <span className="relative text-[11px] font-bold text-white/90 tabular-nums">
                {Math.round(node.load)}%
              </span>
            </div>
            <p className="mt-2 max-w-[88px] text-center text-[10px] font-medium text-white/50 group-hover:text-white/80 line-clamp-2 leading-tight">
              {node.name}
            </p>
          </Link>
        </motion.div>
      ))}

      <div className="absolute bottom-4 start-5 end-5 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Execution Map
        </p>
        <p className="text-[10px] text-white/40">{nodes.length} فرآیند فعال</p>
      </div>
    </div>
  );
}
