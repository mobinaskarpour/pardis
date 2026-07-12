"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { AIInsight } from "@/components/core";
import type { ImagingStudy } from "@/types/imaging";
import { spring, stagger } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { uiLabels } from "@/config/labels";

interface AIAnalysisPanelProps {
  study: ImagingStudy;
}

export function AIAnalysisPanel({ study }: AIAnalysisPanelProps) {
  const { aiAnalysis } = study;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger.container}
      className="rounded-[14px] border border-border bg-bg-elevated p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sparkles size={18} strokeWidth={1.75} className="text-accent-indigo" />
        <h3 className="text-[15px] font-semibold text-text-primary">
          {uiLabels.aiAnalysis}
        </h3>
        <span className="mr-auto text-[13px] text-text-tertiary tabular-nums">
          اطمینان: {toPersianDigits(aiAnalysis.confidence)}٪
        </span>
      </div>

      <motion.div variants={stagger.item}>
        <AIInsight
          title="خلاصه تحلیل"
          description={aiAnalysis.summary}
          confidence={aiAnalysis.confidence}
        />
      </motion.div>

      <motion.div variants={stagger.item}>
        <p className="text-[13px] font-medium text-text-tertiary mb-2">یافته‌ها</p>
        <ul className="space-y-2">
          {aiAnalysis.findings.map((finding) => (
            <li
              key={finding}
              className="flex items-start gap-2 text-[13px] text-text-secondary leading-relaxed"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
              {finding}
            </li>
          ))}
        </ul>
      </motion.div>

      {aiAnalysis.suggestedAction && (
        <motion.div
          variants={stagger.item}
          className="flex items-start gap-2 rounded-[10px] border border-warning/20 bg-warning/5 p-3"
        >
          <AlertCircle size={16} className="text-warning shrink-0 mt-0.5" />
          <p className="text-[13px] text-text-secondary">{aiAnalysis.suggestedAction}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
