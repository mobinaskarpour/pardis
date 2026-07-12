"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AIInsightProps {
  title: string;
  description: string;
  confidence?: number;
  reason?: string;
  suggestedAction?: string;
  onAction?: () => void;
  className?: string;
}

export function AIInsight({
  title,
  description,
  confidence,
  reason,
  suggestedAction,
  onAction,
  className,
}: AIInsightProps) {
  return (
    <Card variant="insight" hover={false} className={className}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-indigo/15">
          <Sparkles size={16} strokeWidth={1.75} className="text-accent-indigo" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary">{title}</h3>
            {confidence !== undefined && (
              <span className="text-[13px] text-text-tertiary shrink-0">
                {confidence}٪ اطمینان
              </span>
            )}
          </div>
          <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">
            {description}
          </p>
          {reason && (
            <p className="mt-2 text-[13px] text-text-tertiary">{reason}</p>
          )}
          {suggestedAction && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...spring.gentle }}
              className="mt-4"
            >
              <Button variant="ai" size="sm" onClick={onAction}>
                {suggestedAction}
                <ArrowLeft size={14} className="rotate-180" strokeWidth={1.75} />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
