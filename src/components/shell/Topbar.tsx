"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, Bell, Menu } from "lucide-react";
import { spring } from "@/lib/motion";
import { user } from "@/lib/mock-data";
import { getNavTitle } from "@/config/navigation";
import { uiLabels } from "@/config/labels";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onSearchOpen: () => void;
  onMenuOpen: () => void;
  pageTitle?: string;
}

export function Topbar({ onSearchOpen, onMenuOpen, pageTitle }: TopbarProps) {
  const pathname = usePathname();
  const title = pageTitle ?? getNavTitle(pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 md:px-5"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-[9px] text-text-secondary transition-colors hover:bg-bg-subtle md:hidden"
          aria-label="باز کردن منو"
        >
          <Menu size={17} strokeWidth={1.75} />
        </button>

        <span className="text-[12px] font-semibold tracking-tight text-text-primary">
          THEMACHINE
        </span>
        {title && (
          <>
            <span className="hidden text-text-muted/50 sm:inline">/</span>
            <span className="hidden text-[12px] text-text-tertiary truncate sm:inline">
              {title}
            </span>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onSearchOpen}
        className={cn(
          "flex flex-1 max-w-sm items-center gap-2 rounded-[11px]",
          "border border-border bg-bg-elevated/90 px-3.5 py-2 text-right",
          "shadow-[var(--shadow-sm)]",
          "transition-all duration-[120ms] hover:border-border-hover",
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted"
        )}
      >
        <Search size={14} strokeWidth={1.75} className="text-text-tertiary shrink-0" />
        <span className="flex-1 text-[13px] text-text-tertiary">
          {uiLabels.searchGlobal}
        </span>
        <kbd className="hidden sm:inline-flex items-center rounded-[5px] border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1 shrink-0">
        <Link href="/chat" aria-label={uiLabels.aiWorkspace}>
          <motion.span
            whileHover={{ scale: 1.04, transition: spring.gentle }}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] text-text-secondary transition-colors hover:bg-bg-subtle cursor-pointer"
          >
            <Sparkles size={16} strokeWidth={1.75} />
          </motion.span>
        </Link>

        <Link href="/notifications" aria-label="اعلان‌ها">
          <motion.span
            whileHover={{ scale: 1.04, transition: spring.gentle }}
            className="relative flex h-8 w-8 items-center justify-center rounded-[9px] text-text-secondary transition-colors hover:bg-bg-subtle cursor-pointer"
          >
            <Bell size={16} strokeWidth={1.75} />
            <span className="absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full bg-error" />
          </motion.span>
        </Link>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02, transition: spring.gentle }}
          className="flex h-8 items-center gap-2 rounded-[9px] px-1.5 transition-colors hover:bg-bg-subtle cursor-pointer"
          aria-label="پروفایل"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[12px] font-medium text-primary">
            {user.initials}
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
}
