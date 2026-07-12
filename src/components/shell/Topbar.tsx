"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, Bell, ChevronLeft } from "lucide-react";
import { spring } from "@/lib/motion";
import { user } from "@/lib/mock-data";
import { pageLabels, uiLabels } from "@/config/labels";

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
        : pageLabels.brand);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.4, ...spring.soft }}
      className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border shrink-0"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-text-tertiary min-w-0">
        <span>{pageLabels.brand}</span>
        <ChevronLeft size={14} strokeWidth={1.75} className="rotate-180 opacity-50" />
        <span className="text-text-primary font-medium truncate">{title}</span>
      </div>

      {/* Search */}
      <button
        type="button"
        onClick={onSearchOpen}
        className="flex flex-1 max-w-md items-center gap-3 rounded-[10px] border border-border bg-bg-elevated/60 px-4 py-2 text-right transition-all duration-[120ms] hover:border-border-hover hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted"
      >
        <Search size={16} strokeWidth={1.75} className="text-text-tertiary shrink-0" />
        <span className="flex-1 text-[15px] text-text-tertiary">
          {uiLabels.searchGlobal}
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-[6px] border border-border px-1.5 py-0.5 text-[11px] text-text-tertiary">
          Ctrl+K
        </kbd>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/chat" aria-label={uiLabels.aiWorkspace}>
          <motion.span
            whileHover={{ y: -2, transition: spring.gentle }}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-bg-elevated text-text-secondary transition-colors duration-[120ms] hover:border-border-hover cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted"
          >
            <Sparkles size={18} strokeWidth={1.75} />
          </motion.span>
        </Link>

        <motion.button
          type="button"
          whileHover={{ y: -2, transition: spring.gentle }}
          className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-bg-elevated text-text-secondary transition-colors duration-[120ms] hover:border-border-hover cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted"
          aria-label="اعلان‌ها"
        >
          <Bell size={18} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-error" />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2, transition: spring.gentle }}
          className="flex h-9 items-center gap-2 rounded-[10px] border border-border bg-bg-elevated px-3 transition-colors duration-[120ms] hover:border-border-hover cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-muted"
          aria-label="پروفایل"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[13px] font-medium text-primary">
            {user.initials}
          </span>
          <span className="hidden md:block text-[13px] text-text-secondary">
            {user.name}
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
}
