"use client";

import { motion } from "framer-motion";
import { Sparkles, Search, Plug2 } from "lucide-react";
import { spring, heroEntrance } from "@/lib/motion";
import { toPersianDigits } from "@/lib/persian";
import { getConnectionStats } from "@/mock/data/integrations";
import type { Integration } from "@/types/integration";
import { IntegrationCard } from "./IntegrationCard";

interface IntegrationsHeroProps {
  totalCount: number;
  enabledCount: number;
  connectedCount: number;
}

export function IntegrationsHero({
  totalCount,
  enabledCount,
  connectedCount,
}: IntegrationsHeroProps) {
  return (
    <motion.section
      variants={heroEntrance}
      initial="initial"
      animate="animate"
      className="relative mb-12"
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-primary/6 blur-3xl" />
      <div className="pointer-events-none absolute top-10 left-20 h-48 w-48 rounded-full bg-accent-indigo/5 blur-3xl" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, ...spring.soft }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/60 backdrop-blur-sm px-3.5 py-1.5 mb-5"
        >
          <Plug2 size={14} strokeWidth={1.75} className="text-primary" />
          <span className="text-[12px] font-medium text-text-secondary">
            THEMACHINE · اتصال به هر سیستم
          </span>
        </motion.div>

        <h1 className="text-[44px] font-semibold text-text-primary leading-[1.15] tracking-tight max-w-3xl">
          اتصالات هوشمند
        </h1>

        <p className="mt-4 text-[17px] text-text-secondary leading-relaxed max-w-2xl">
          اتصالات تخصصی مرکز تصویربرداری — PACS، دستگاه‌ها، بیمه، پیام‌رسانی
          بیمار و حسابداری. هر اتصال را می‌توانید روشن یا خاموش کنید.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[28px] font-semibold text-text-primary tabular-nums">
              {toPersianDigits(totalCount)}
            </p>
            <p className="text-[13px] text-text-tertiary">اتصال تخصصی</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-[28px] font-semibold text-primary tabular-nums">
              {toPersianDigits(enabledCount)}
            </p>
            <p className="text-[13px] text-text-tertiary">فعال</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-[28px] font-semibold text-success tabular-nums">
              {toPersianDigits(connectedCount)}
            </p>
            <p className="text-[13px] text-text-tertiary">متصل</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface SmartSuggestionBannerProps {
  suggestion: string;
}

export function SmartSuggestionBanner({ suggestion }: SmartSuggestionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, ...spring.soft }}
      className="mb-8 flex items-start gap-3 rounded-[16px] border border-accent-indigo/15 bg-gradient-to-l from-accent-indigo/6 to-transparent p-4 backdrop-blur-sm"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-accent-indigo/10">
        <Sparkles size={18} strokeWidth={1.75} className="text-accent-indigo" />
      </div>
      <div>
        <p className="text-[12px] font-medium text-accent-indigo mb-1">
          پیشنهاد هوش مصنوعی
        </p>
        <p className="text-[14px] text-text-secondary leading-relaxed">
          {suggestion}
        </p>
      </div>
    </motion.div>
  );
}

interface IntegrationSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function IntegrationSearch({ value, onChange }: IntegrationSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, ...spring.gentle }}
      className="relative mb-8 max-w-xl"
    >
      <Search
        size={18}
        strokeWidth={1.75}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجوی اتصالات — PACS، واتساپ، سپیدار..."
        className="w-full rounded-[16px] border border-border bg-bg-elevated/70 backdrop-blur-sm py-3.5 pr-12 pl-4 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-[140ms] focus:border-primary/30 focus:shadow-[var(--shadow-sm)] focus:outline-none"
      />
    </motion.div>
  );
}

interface CategoryTabsProps {
  categories: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}

export function CategoryTabs({
  categories,
  active,
  onChange,
  counts,
}: CategoryTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, ...spring.gentle }}
      className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
    >
      {categories.map((cat) => {
        const isActive = active === cat.id;
        const count = counts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`
              relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium
              transition-all duration-[140ms] cursor-pointer
              ${
                isActive
                  ? "bg-primary text-white shadow-[var(--shadow-sm)]"
                  : "border border-border bg-bg-elevated/60 text-text-secondary hover:border-border-hover hover:text-text-primary"
              }
            `}
          >
            {cat.label}
            <span
              className={`mr-1.5 text-[11px] ${isActive ? "text-white/70" : "text-text-muted"}`}
            >
              {toPersianDigits(count)}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}

interface ConnectionOverviewProps {
  stats: ReturnType<typeof getConnectionStats>;
}

export function ConnectionOverview({ stats }: ConnectionOverviewProps) {
  const items = [
    {
      label: "فعال",
      value: stats.enabled,
      color: "text-primary",
      dot: "bg-primary",
    },
    {
      label: "متصل",
      value: stats.connected,
      color: "text-success",
      dot: "bg-success",
    },
    {
      label: "در حال اتصال",
      value: stats.syncing,
      color: "text-accent-cyan",
      dot: "bg-accent-cyan",
    },
    {
      label: "نیاز به توجه",
      value: stats.needsAttention,
      color: "text-warning",
      dot: "bg-warning",
    },
    {
      label: "غیرفعال",
      value: stats.disabled,
      color: "text-text-tertiary",
      dot: "bg-text-muted",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, ...spring.soft }}
      className="mt-14 rounded-[20px] border border-border/80 bg-[color-mix(in_srgb,var(--bg-elevated)_80%,transparent)] backdrop-blur-xl p-6 shadow-[var(--shadow-sm)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[18px] font-semibold text-text-primary">
            وضعیت اتصالات
          </h2>
          <p className="mt-1 text-[13px] text-text-tertiary">
            {toPersianDigits(stats.total)} اتصال تخصصی · {toPersianDigits(stats.enabled)} فعال
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
          همه سیستم‌ها در حال نظارت
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.04, ...spring.gentle }}
            className="rounded-[14px] border border-border/60 bg-bg-subtle/40 px-4 py-3.5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-2 w-2 rounded-full ${item.dot}`} />
              <span className="text-[12px] text-text-tertiary">{item.label}</span>
            </div>
            <p className={`text-[24px] font-semibold tabular-nums ${item.color}`}>
              {toPersianDigits(item.value)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

interface RecommendedSectionProps {
  integrations: Integration[];
  runtime: Record<string, import("@/types/integration").IntegrationRuntime>;
  onToggle: (id: string) => void;
  onConnect: (id: string) => void;
}

export function RecommendedSection({
  integrations,
  runtime,
  onToggle,
  onConnect,
}: RecommendedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, ...spring.soft }}
      className="mb-12"
    >
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={18} strokeWidth={1.75} className="text-accent-indigo" />
        <h2 className="text-[18px] font-semibold text-text-primary">
          پیشنهادهای هوشمند
        </h2>
      </div>
      <p className="text-[13px] text-text-tertiary mb-6 -mt-3">
        بر اساس نیازهای مرکز تصویربرداری شما
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {integrations.map((item, i) => (
          <IntegrationCard
            key={item.id}
            integration={item}
            runtime={runtime[item.id]}
            index={i}
            featured
            onToggle={() => onToggle(item.id)}
            onConnect={() => onConnect(item.id)}
          />
        ))}
      </div>
    </motion.section>
  );
}
