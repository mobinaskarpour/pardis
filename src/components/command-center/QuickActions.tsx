"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserPlus,
  FilePlus,
  Sparkles,
  Scan,
  Layers,
  Search,
  type LucideIcon,
} from "lucide-react";
import { spring } from "@/lib/motion";
import { quickActions } from "@/lib/mock-data";
import { Button } from "@/components/core";

const iconMap: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  "file-plus": FilePlus,
  sparkles: Sparkles,
  scan: Scan,
  layers: Layers,
  search: Search,
};

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 1.8, ...spring.soft }}
    >
      <p className="mb-3 text-[13px] font-medium text-text-tertiary">
        اقدام سریع
      </p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, i) => {
          const Icon = iconMap[action.icon];
          const button = (
            <Button size="sm">
              {Icon && <Icon size={16} strokeWidth={1.75} />}
              {action.label}
            </Button>
          );

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 + i * 0.05, ...spring.gentle }}
            >
              {"href" in action && action.href ? (
                <Link href={action.href}>{button}</Link>
              ) : (
                button
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
