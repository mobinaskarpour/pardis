"use client";

import { motion } from "framer-motion";
import {
  Link2,
  ExternalLink,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";
import type { ConnectionStatus, Integration, IntegrationRuntime } from "@/types/integration";
import { resolveDisplayStatus } from "@/mock/data/integrations";
import { IntegrationLogo } from "./IntegrationLogo";

const statusConfig: Record<
  ConnectionStatus,
  { label: string; dot: string; bg: string; text: string; pulse?: boolean }
> = {
  connected: {
    label: "متصل",
    dot: "bg-success",
    bg: "bg-success/8",
    text: "text-success",
  },
  syncing: {
    label: "در حال اتصال",
    dot: "bg-accent-cyan",
    bg: "bg-accent-cyan/10",
    text: "text-accent-cyan",
    pulse: true,
  },
  needs_attention: {
    label: "نیاز به توجه",
    dot: "bg-warning",
    bg: "bg-warning/10",
    text: "text-warning",
  },
  disconnected: {
    label: "قطع",
    dot: "bg-text-muted",
    bg: "bg-bg-subtle",
    text: "text-text-tertiary",
  },
  update_available: {
    label: "به‌روزرسانی",
    dot: "bg-accent-indigo",
    bg: "bg-accent-indigo/10",
    text: "text-accent-indigo",
  },
  disabled: {
    label: "غیرفعال",
    dot: "bg-text-muted",
    bg: "bg-bg-subtle/80",
    text: "text-text-muted",
  },
};

interface IntegrationCardProps {
  integration: Integration;
  runtime: IntegrationRuntime;
  index?: number;
  featured?: boolean;
  onToggle: () => void;
  onConnect: () => void;
}

function Toggle({
  active,
  onChange,
  disabled,
}: {
  active: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={active ? "غیرفعال‌سازی" : "فعال‌سازی"}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors duration-[200ms] cursor-pointer shrink-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted",
        active ? "bg-primary" : "bg-bg-muted",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <motion.span
        layout={!reduced}
        transition={spring.snappy}
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[var(--shadow-sm)]",
          active ? "right-0.5" : "right-[22px]"
        )}
      />
    </button>
  );
}

function MetaSection({
  title,
  items,
  dotClass,
}: {
  title: string;
  items: string[];
  dotClass: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-text-tertiary mb-1.5">{title}</p>
      <ul className="space-y-0.5">
        {items.slice(0, 3).map((item) => (
          <li
            key={item}
            className="text-[11px] text-text-secondary leading-snug truncate flex items-center gap-1"
            title={item}
          >
            <span className={cn("h-1 w-1 rounded-full shrink-0", dotClass)} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IntegrationCard({
  integration,
  runtime,
  index = 0,
  featured = false,
  onToggle,
  onConnect,
}: IntegrationCardProps) {
  const reduced = useReducedMotion();
  const displayStatus = resolveDisplayStatus(integration, runtime);
  const status = statusConfig[displayStatus];
  const isEnabled = runtime.enabled;
  const isConnected =
    isEnabled &&
    (displayStatus === "connected" ||
      displayStatus === "syncing" ||
      displayStatus === "needs_attention");
  const isSyncing = displayStatus === "syncing";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: index * 0.04, ...spring.soft }}
      whileHover={
        reduced || !isEnabled
          ? undefined
          : { y: -4, transition: spring.gentle }
      }
      className={cn(
        "group relative flex flex-col rounded-[20px] border border-border-strong",
        "bg-[color-mix(in_srgb,var(--bg-elevated)_78%,transparent)]",
        "backdrop-blur-xl shadow-[var(--shadow-sm)]",
        "transition-[box-shadow,border-color,opacity] duration-[180ms]",
        isEnabled
          ? "hover:border-primary/20 hover:shadow-[var(--shadow-float)]"
          : "opacity-75 hover:opacity-90",
        featured && isEnabled && "ring-1 ring-accent-indigo/15"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[20px] opacity-0 transition-opacity duration-[200ms]",
          "bg-gradient-to-br from-primary/10 via-transparent to-accent-indigo/10",
          "group-hover:opacity-100"
        )}
      />

      <div className="relative p-5 flex flex-col flex-1">
        {/* Logo + link */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <motion.div
            whileHover={reduced ? undefined : { scale: 1.05, rotate: -2 }}
            transition={spring.gentle}
          >
            <IntegrationLogo
              id={integration.id}
              icon={integration.icon}
              color={integration.color}
              enabled={isEnabled}
            />
          </motion.div>

          <button
            type="button"
            aria-label="جزئیات"
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-[140ms] hover:bg-bg-subtle/80 cursor-pointer"
          >
            <ExternalLink size={14} strokeWidth={1.75} />
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={cn(
              "text-[16px] font-semibold leading-snug",
              isEnabled ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {integration.name}
          </h3>
          {integration.recommended && (
            <span className="rounded-full bg-accent-indigo/10 px-2 py-0.5 text-[10px] font-medium text-accent-indigo">
              پیشنهادی
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[13px] text-text-tertiary leading-relaxed line-clamp-2">
          {integration.description}
        </p>

        {/* Status */}
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium",
              status.bg,
              status.text
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className={cn("h-2 w-2 rounded-full", status.dot)} />
              {status.pulse && !reduced && (
                <motion.span
                  className={cn("absolute inset-0 rounded-full opacity-60", status.dot)}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{
                    type: "tween",
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </span>
            {status.label}
          </span>
        </div>

        {/* Signals & actions — compact 2-col inside soft panel */}
        {isEnabled ? (
          <div className="mt-3 rounded-[12px] bg-bg-subtle/50 border border-border/40 p-3 grid grid-cols-2 gap-3">
            <MetaSection
              title="سیگنال‌های پایش‌شده"
              items={integration.signals}
              dotClass="bg-primary/50"
            />
            <MetaSection
              title="اقدام‌های در دسترس"
              items={integration.actions}
              dotClass="bg-accent-indigo/50"
            />
          </div>
        ) : (
          <div className="mt-3 rounded-[12px] border border-dashed border-border/70 bg-bg-subtle/30 px-3 py-2.5">
            <p className="text-[12px] text-text-muted">
              غیرفعال — سوییچ را روشن کنید
            </p>
          </div>
        )}

        {/* Sync */}
        {isConnected && runtime.lastSync && (
          <div className="mt-3 rounded-[12px] bg-bg-subtle/60 px-3 py-2.5 space-y-0.5">
            <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
              <Check size={12} strokeWidth={2} className="text-success shrink-0" />
              <span>
                {isSyncing
                  ? runtime.lastSync
                  : `آخرین همگام‌سازی: ${runtime.lastSync}`}
              </span>
            </div>
            {integration.version && !isSyncing && (
              <p className="text-[11px] text-text-muted pr-5">
                نسخه {integration.version}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-5 flex items-center justify-between gap-2 border-t border-border/60">
          {!isEnabled ? (
            <button
              type="button"
              onClick={onConnect}
              className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-medium border border-primary/30 bg-primary/8 text-primary hover:bg-primary/12 transition-colors cursor-pointer"
            >
              <Link2 size={14} strokeWidth={1.75} />
              اتصال
            </button>
          ) : isSyncing ? (
            <span className="text-[12px] text-accent-cyan px-1">در حال اتصال...</span>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-medium border border-border bg-bg-elevated/80 text-text-secondary hover:border-border-hover transition-colors cursor-pointer"
            >
              <Link2 size={14} strokeWidth={1.75} />
              مدیریت
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="بیشتر"
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-text-muted hover:bg-bg-subtle/80 transition-colors cursor-pointer"
            >
              <MoreHorizontal size={16} strokeWidth={1.75} />
            </button>
            <Toggle active={isEnabled} onChange={onToggle} disabled={isSyncing} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
