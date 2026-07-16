"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  GitBranch,
  Globe,
  Moon,
  MoreHorizontal,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  primaryNavItems,
  isPrimaryNavActive,
  isMoreNavActive,
} from "@/config/navigation";
import { user } from "@/lib/mock-data";
import { useWorkflowStore } from "@/store/workflow-store";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const sidebarConversations = [
  { id: "c1", title: "گزارش‌های آماده امروز", href: "/chat" },
  { id: "c2", title: "بیماران منتظر MRI", href: "/chat" },
  { id: "c3", title: "تأخیر گزارش دکتر موسوی", href: "/chat" },
  { id: "c4", title: "QC دستگاه MRI-2", href: "/chat" },
];

const navIcons: Record<string, typeof BarChart3> = {
  "mission-control": BarChart3,
  "ai-conversation": Sparkles,
  "workflow-studio": GitBranch,
  integrations: Globe,
};

interface AppSidebarProps {
  onOpenMore: () => void;
}

export function AppSidebar({ onOpenMore }: AppSidebarProps) {
  const pathname = usePathname();
  const workflows = useWorkflowStore((s) => s.workflows);
  const moreActive = isMoreNavActive(pathname);

  const identified = workflows.filter((w) => w.enabled).slice(0, 5);

  return (
    <aside
      className={cn(
        "flex h-full w-[280px] shrink-0 flex-col",
        "border-s border-border/70 bg-white",
        "shadow-[-8px_0_32px_rgba(17,19,24,0.04)]"
      )}
      aria-label="ناوبری اصلی"
    >
      {/* Brand */}
      <div className="border-b border-border/50 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
          THE MACHINE
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-text-tertiary">
          پردیس نور · AI OS
        </p>
      </div>

      {/* Profile */}
      <div className="px-4 py-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-[14px] p-3",
            "border border-border/60 bg-gradient-to-br from-primary/[0.05] to-transparent"
          )}
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              "bg-gradient-to-br from-primary to-primary-muted text-[15px] font-bold text-white",
              "shadow-[0_4px_12px_rgba(45,90,123,0.25)]"
            )}
          >
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-text-primary">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-text-muted">{user.role}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-none">
        <Link
          href="/chat"
          className={cn(
            "mb-5 flex w-full items-center justify-center gap-2 rounded-[12px]",
            "bg-primary px-4 py-2.5 text-[13px] font-semibold text-white",
            "shadow-[0_4px_14px_rgba(45,90,123,0.28)] transition-all",
            "hover:bg-primary-muted hover:shadow-[0_6px_20px_rgba(45,90,123,0.32)]"
          )}
        >
          <Plus size={16} strokeWidth={2} />
          گفتگوی جدید
        </Link>

        <nav className="space-y-1">
          {primaryNavItems.map((item) => {
            const active = isPrimaryNavActive(pathname, item.href);
            const Icon = navIcons[item.id] ?? BarChart3;

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
                    "relative flex items-center gap-3 rounded-[12px] px-3 py-2.5",
                    "text-[13px] font-medium transition-colors duration-150",
                    item.featured && !active && "ring-1 ring-accent-indigo/12",
                    active
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-nav-active"
                      className="absolute inset-0 rounded-[12px] bg-primary/[0.08]"
                      transition={spring.soft}
                    />
                  )}

                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]",
                      active
                        ? "bg-primary/12 text-primary"
                        : "bg-bg-subtle/80 text-text-tertiary group-hover:bg-bg-subtle"
                    )}
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
            گردش‌کارهای شناسایی‌شده
          </p>
          <ul className="space-y-0.5">
            {identified.map((wf, i) => (
              <li key={wf.id}>
                <Link
                  href={`/workflows/${wf.id}`}
                  className="group flex items-start gap-2.5 rounded-[10px] px-3 py-2 transition-colors hover:bg-bg-subtle/60"
                >
                  <Sparkles
                    size={13}
                    className="mt-0.5 shrink-0 text-accent-indigo/80"
                    strokeWidth={1.75}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[12px] leading-snug text-text-secondary group-hover:text-text-primary">
                      {wf.name}
                    </span>
                    {wf.source === "ai" && i === 0 && (
                      <span className="mt-1 inline-block rounded-[5px] bg-accent-indigo/10 px-1.5 py-px text-[9px] font-bold text-accent-indigo">
                        جدید
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
            گفتگوها
          </p>
          <ul className="space-y-0.5">
            {sidebarConversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  className="block truncate rounded-[10px] px-3 py-2 text-[12px] text-text-tertiary transition-colors hover:bg-bg-subtle/60 hover:text-text-secondary"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50 p-3 space-y-0.5">
        <button
          type="button"
          onClick={onOpenMore}
          className={cn(
            "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-colors",
            moreActive
              ? "bg-bg-subtle text-text-primary"
              : "text-text-tertiary hover:bg-bg-subtle/60 hover:text-text-secondary"
          )}
        >
          <MoreHorizontal size={17} strokeWidth={1.75} />
          ⋯ بیشتر
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] text-text-muted transition-colors hover:bg-bg-subtle/60"
        >
          <Moon size={17} strokeWidth={1.75} />
          ظاهر
        </button>
      </div>
    </aside>
  );
}
