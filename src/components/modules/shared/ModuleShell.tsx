"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { spring } from "@/lib/motion";
import { Button, Input } from "@/components/core";
import { uiLabels } from "@/config/labels";

interface ModuleHeroProps {
  title: string;
  subtitle: string;
  aiSummary: string;
}

export function ModuleHero({ title, subtitle, aiSummary }: ModuleHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="mb-8"
    >
      <p className="text-[12px] font-medium text-text-tertiary">{subtitle}</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-text-primary leading-tight">
        {title}
      </h1>
      <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-border bg-bg-elevated p-4 max-w-3xl shadow-[var(--shadow-sm)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
          <Sparkles
            size={15}
            strokeWidth={1.75}
            className="text-primary"
          />
        </span>
        <p className="text-[13px] text-text-secondary leading-relaxed pt-0.5">
          {aiSummary}
        </p>
      </div>
    </motion.section>
  );
}

interface AIDockProps {
  suggestions: string[];
  quickActions?: { label: string; href?: string }[];
  onSuggestionClick?: (s: string) => void;
}

export function AIDock({
  suggestions,
  quickActions = [],
  onSuggestionClick,
}: AIDockProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12, ...spring.soft }}
      className="rounded-[14px] border border-border-strong bg-bg-elevated p-4 h-fit sticky top-6 shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles size={14} strokeWidth={1.75} className="text-primary" />
        <p className="text-[12px] font-semibold text-text-secondary">
          {uiLabels.aiDock}
        </p>
      </div>

      <div className="space-y-0.5 mb-3">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick?.(s)}
            className="block w-full rounded-[9px] px-2.5 py-2 text-right text-[12px] text-text-secondary hover:bg-bg-subtle hover:text-primary transition-colors duration-[120ms] cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {quickActions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
          {quickActions.map((action) =>
            action.href ? (
              <Link key={action.label} href={action.href}>
                <Button size="sm">{action.label}</Button>
              </Link>
            ) : (
              <Button key={action.label} size="sm">
                {action.label}
              </Button>
            )
          )}
        </div>
      )}
    </motion.aside>
  );
}

interface SmartFilterProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SmartFilter({
  value,
  onChange,
  placeholder = "جستجو یا فیلتر طبیعی — مثلاً MRIهای امروز",
}: SmartFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06, ...spring.gentle }}
      className="mb-6 max-w-xl"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </motion.div>
  );
}
