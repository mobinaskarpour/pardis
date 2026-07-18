"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import {
  primaryNavItems,
  isPrimaryNavActive,
  isMoreNavActive,
} from "@/config/navigation";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface DockProps {
  onOpenMore: () => void;
}

export function Dock({ onOpenMore }: DockProps) {
  const pathname = usePathname();
  const moreActive = isMoreNavActive(pathname);

  return (
    <nav
      className={cn(
        "flex w-[212px] flex-col rounded-[24px] border border-white/70",
        "bg-white/78 p-3 backdrop-blur-2xl",
        "shadow-[0_16px_48px_rgba(17,19,24,0.08),0_0_0_1px_rgba(17,19,24,0.03)]"
      )}
      aria-label="ناوبری اصلی"
    >
      <div className="mb-4 px-2 pt-1">
        <p className="text-[10px] font-semibold tracking-tight text-text-muted">
          THEMACHINE
        </p>
        <p className="mt-0.5 text-[11px] text-text-tertiary">چهار تجربه اصلی</p>
      </div>

      <div className="flex flex-col gap-1">
        {primaryNavItems.map((item) => {
          const active = isPrimaryNavActive(pathname, item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="group relative block"
            >
              <motion.div
                whileHover={{ x: -2, transition: spring.gentle }}
                whileTap={{ scale: 0.985, transition: spring.snappy }}
                className={cn(
                  "relative flex items-center gap-3 rounded-[16px] px-3 py-2.5",
                  "transition-colors duration-[160ms]",
                  item.featured && !active && "ring-1 ring-accent-indigo/10",
                  active
                    ? "bg-primary/[0.09] text-primary"
                    : "text-text-secondary hover:bg-bg-subtle/60 hover:text-text-primary"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-[16px] bg-primary/[0.07]"
                    transition={spring.soft}
                  />
                )}

                {item.featured && (
                  <div
                    className="absolute inset-0 rounded-[16px] bg-gradient-to-l from-accent-indigo/[0.06] to-transparent pointer-events-none"
                    aria-hidden
                  />
                )}

                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[17px]",
                    active
                      ? "bg-white shadow-[0_2px_10px_rgba(45,90,123,0.12)]"
                      : "bg-bg-subtle/50 group-hover:bg-white group-hover:shadow-[0_2px_8px_rgba(17,19,24,0.06)]"
                  )}
                  aria-hidden
                >
                  {item.emoji}
                </span>

                <span className="relative z-10 min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold leading-tight">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-medium text-text-muted">
                    {item.subtitle}
                  </span>
                </span>

                {active && (
                  <span
                    className="absolute right-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                    aria-hidden
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="my-3 h-px bg-border/80" />

      <button
        type="button"
        onClick={onOpenMore}
        className={cn(
          "group flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5",
          "transition-colors duration-[160ms]",
          moreActive
            ? "bg-bg-subtle/80 text-text-primary ring-1 ring-border-strong"
            : "text-text-tertiary hover:bg-bg-subtle/60 hover:text-text-secondary"
        )}
        aria-expanded={false}
        aria-haspopup="dialog"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]",
            moreActive
              ? "bg-white shadow-[0_2px_8px_rgba(17,19,24,0.06)]"
              : "bg-bg-subtle/40 group-hover:bg-white"
          )}
        >
          <MoreHorizontal size={18} strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1 text-right">
          <span className="block text-[13px] font-semibold">⋯ بیشتر</span>
          <span className="mt-0.5 block text-[10px] text-text-muted">
            ماژول‌های پشتیبان
          </span>
        </span>
      </button>
    </nav>
  );
}
