"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, Bell } from "lucide-react";
import { spring } from "@/lib/motion";
import { user } from "@/lib/mock-data";
import { pageLabels, uiLabels } from "@/config/labels";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/": pageLabels.home,
  "/chat": pageLabels.chat,
  "/patients": pageLabels.patients,
  "/doctors": pageLabels.doctors,
  "/imaging": pageLabels.imaging,
  "/appointments": pageLabels.appointments,
  "/reports": pageLabels.reports,
  "/analytics": pageLabels.analytics,
  "/knowledge": pageLabels.knowledge,
  "/workflows": pageLabels.workflows,
  "/automation": pageLabels.automation,
  "/financial": pageLabels.financial,
  "/notifications": pageLabels.notifications,
  "/integrations": pageLabels.integrations,
  "/settings": pageLabels.settings,
};

interface TopbarProps {
  onSearchOpen: () => void;
  pageTitle?: string;
}

export function Topbar({ onSearchOpen, pageTitle }: TopbarProps) {
  const pathname = usePathname();
  const title =
    pageTitle ??
    pageTitles[pathname] ??
    (pathname.startsWith("/patients/")
      ? pageLabels.patientProfile
      : pathname.startsWith("/doctors/")
        ? pageLabels.doctorProfile
        : null);

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3 md:px-10"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[var(--text-sm)] font-semibold tracking-tight text-text-primary">
          THE MACHINE
        </span>
        {title && (
          <>
            <span className="text-text-muted">·</span>
            <span className="text-[var(--text-sm)] text-text-tertiary truncate">
              {title}
            </span>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onSearchOpen}
        className={cn(
          "flex flex-1 max-w-sm items-center gap-2.5 rounded-[var(--radius-xl)]",
          "glass-subtle px-4 py-2 text-right",
          "transition-all duration-[140ms] hover:shadow-[var(--shadow-sm)]",
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted"
        )}
      >
        <Search size={15} strokeWidth={1.75} className="text-text-tertiary shrink-0" />
        <span className="flex-1 text-[var(--text-body)] text-text-tertiary">
          {uiLabels.searchGlobal}
        </span>
        <kbd className="hidden sm:inline-flex items-center rounded-[6px] border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5 shrink-0">
        <Link href="/chat" aria-label={uiLabels.aiWorkspace}>
          <motion.span
            whileHover={{ scale: 1.05, transition: spring.gentle }}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-text-secondary transition-colors hover:bg-bg-subtle/80 cursor-pointer"
          >
            <Sparkles size={17} strokeWidth={1.75} />
          </motion.span>
        </Link>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05, transition: spring.gentle }}
          className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-text-secondary transition-colors hover:bg-bg-subtle/80 cursor-pointer"
          aria-label="اعلان‌ها"
        >
          <Bell size={17} strokeWidth={1.75} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-error" />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02, transition: spring.gentle }}
          className="flex h-9 items-center gap-2 rounded-[var(--radius-lg)] px-2 transition-colors hover:bg-bg-subtle/80 cursor-pointer"
          aria-label="پروفایل"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/12 text-[var(--text-sm)] font-medium text-primary">
            {user.initials}
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
}
