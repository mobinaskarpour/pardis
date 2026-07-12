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
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={spring.soft}
      className="mb-10"
    >
      <p className="text-[13px] font-medium text-text-tertiary">{subtitle}</p>
      <h1 className="mt-1 text-[36px] font-semibold text-text-primary leading-tight">
        {title}
      </h1>
      <div className="mt-5 flex items-start gap-3 rounded-[14px] border border-border bg-bg-elevated/60 p-4 max-w-3xl">
        <Sparkles
          size={18}
          strokeWidth={1.75}
          className="text-accent-indigo shrink-0 mt-0.5"
        />
        <p className="text-[15px] text-text-secondary leading-relaxed">
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
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, ...spring.soft }}
      className="rounded-[14px] border border-border bg-bg-elevated/60 p-5 h-fit sticky top-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} strokeWidth={1.75} className="text-accent-indigo" />
        <p className="text-[13px] font-medium text-text-tertiary">{uiLabels.aiDock}</p>
      </div>

      <div className="space-y-2 mb-4">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick?.(s)}
            className="block w-full text-right text-[13px] text-text-secondary hover:text-primary transition-colors duration-[120ms] py-1 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
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
      transition={{ delay: 0.1, ...spring.gentle }}
      className="mb-8 max-w-xl"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </motion.div>
  );
}
