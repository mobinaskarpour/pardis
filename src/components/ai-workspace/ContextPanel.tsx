"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Brain,
  Link2,
  GitBranch,
  Save,
  Share2,
  FileDown,
} from "lucide-react";
import { spring } from "@/lib/motion";
import type { Citation, AIAction } from "@/lib/ai-workspace-data";
import { cn } from "@/lib/utils";
import { pageLabels } from "@/config/labels";

interface ContextPanelProps {
  reasoning?: string[];
  citations?: Citation[];
  actions?: AIAction[];
  contextPage?: string;
}

const actionIcons: Record<string, typeof Save> = {
  workflow: GitBranch,
  report: FileText,
  save: Save,
  share: Share2,
  pdf: FileDown,
  activate: GitBranch,
  edit: FileText,
  register: FileText,
  summarize: Brain,
};

export function ContextPanel({
  reasoning,
  citations,
  actions,
  contextPage = pageLabels.chat,
}: ContextPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-border bg-bg-elevated/40 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <p className="text-[13px] font-medium text-text-tertiary">زمینه</p>
        <p className="mt-1 text-[15px] text-text-primary">{contextPage}</p>
      </div>

      {reasoning && reasoning.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} strokeWidth={1.75} className="text-accent-indigo" />
            <p className="text-[13px] font-medium text-text-tertiary">استدلال</p>
          </div>
          <div className="space-y-2">
            {reasoning.map((item) => (
              <p key={item} className="text-[13px] text-text-secondary leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {citations && citations.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={16} strokeWidth={1.75} className="text-primary" />
            <p className="text-[13px] font-medium text-text-tertiary">Sources</p>
          </div>
          <div className="space-y-2">
            {citations.map((cite) => (
              <motion.div
                key={cite.id}
                whileHover={{ x: -2, transition: spring.gentle }}
                className="rounded-[6px] border border-border px-3 py-2 transition-colors duration-[120ms] hover:border-border-hover"
              >
                <p className="text-[13px] text-text-primary">{cite.label}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  {cite.source}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="p-4">
          <p className="text-[13px] font-medium text-text-tertiary mb-3">
            اقدامات هوش مصنوعی
          </p>
          <div className="space-y-1.5">
            {actions.map((action) => {
              const Icon = actionIcons[action.id] ?? FileText;
              return (
                <motion.button
                  key={action.id}
                  type="button"
                  whileHover={{ x: -2, transition: spring.gentle }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[6px] px-3 py-2",
                    "text-[13px] text-text-secondary transition-colors duration-[120ms]",
                    "hover:bg-bg-subtle hover:text-text-primary cursor-pointer text-right"
                  )}
                >
                  <Icon size={14} strokeWidth={1.75} />
                  {action.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
