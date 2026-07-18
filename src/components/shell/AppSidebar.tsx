"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  GitBranch,
  Globe,
  LayoutDashboard,
  Moon,
  MoreHorizontal,
  Plus,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  primaryNavItems,
  isPrimaryNavActive,
  isMoreNavActive,
} from "@/config/navigation";
import { user } from "@/lib/mock-data";
import { useWorkflowStore } from "@/store/workflow-store";
import { useThemeStore, resolveTheme } from "@/store/theme-store";
import { useDashboardStore } from "@/store/dashboard-store";
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
  const dashboards = useDashboardStore((s) => s.dashboards);
  const moreActive = isMoreNavActive(pathname);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const resolved = resolveTheme(theme);
  const identified = workflows.filter((w) => w.enabled).slice(0, 5);
  const recentDashboards = dashboards.slice(0, 5);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <aside
      className={cn(
        "flex h-full w-[var(--sidebar-width)] shrink-0 flex-col",
        "m-3 me-0 rounded-[var(--radius-xl)]",
        "border border-border/80 bg-bg-elevated",
        "shadow-[var(--shadow-sm)]"
      )}
      aria-label="ناوبری اصلی"
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-[11px] font-bold tracking-wide text-white">
            TM
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold tracking-tight text-text-primary">
              THEMACHINE
            </p>
            <p className="text-[11px] text-text-muted">پردیس نور</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-[12px] px-2.5 py-2",
            "border border-border/70 bg-bg-layer-1"
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              "bg-primary/10 text-[13px] font-semibold text-primary"
            )}
          >
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-text-primary">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-text-muted">{user.role}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2 scrollbar-none">
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }} transition={spring.gentle}>
          <Link
            href="/chat"
            className={cn(
              "mb-4 flex w-full items-center justify-center gap-2 rounded-[11px]",
              "bg-primary px-3.5 py-2.5 text-[13px] font-semibold text-white",
              "shadow-[var(--shadow-sm)] transition-colors",
              "hover:bg-primary-muted"
            )}
          >
            <Plus size={15} strokeWidth={2} />
            گفتگوی جدید
          </Link>
        </motion.div>

        <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.08em] text-text-muted">
          اصلی
        </p>
        <nav className="space-y-0.5">
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
                  whileHover={{ x: -1, transition: spring.gentle }}
                  whileTap={{ scale: 0.985, transition: spring.snappy }}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-[11px] px-2.5 py-2",
                    "text-[13px] font-medium transition-colors duration-150",
                    active
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId={moreActive ? undefined : "sidebar-nav-active"}
                      className="absolute inset-0 rounded-[11px] bg-primary/[0.09]"
                      transition={spring.soft}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId={moreActive ? undefined : "sidebar-nav-rail"}
                      className="absolute end-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                      transition={spring.soft}
                    />
                  )}

                  <span
                    className={cn(
                      "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]",
                      active
                        ? "bg-primary/12 text-primary"
                        : "text-text-tertiary group-hover:bg-bg-subtle group-hover:text-text-secondary"
                    )}
                  >
                    <Icon size={15} strokeWidth={1.75} />
                  </span>
                  <span className="relative z-10">{item.label}</span>
                  {item.featured && !active && (
                    <span
                      className="relative z-10 ms-auto rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold text-accent-indigo/80 bg-accent-indigo/8"
                      aria-hidden
                    >
                      AI
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-5">
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.08em] text-text-muted">
            گردش‌کارها
          </p>
          <ul className="space-y-0.5">
            {identified.map((wf, i) => (
              <li key={wf.id}>
                <Link
                  href={`/workflows/${wf.id}`}
                  className="group flex items-start gap-2 rounded-[10px] px-2.5 py-1.5 transition-colors hover:bg-bg-subtle/70"
                >
                  <Sparkles
                    size={12}
                    className="mt-0.5 shrink-0 text-accent-indigo/70"
                    strokeWidth={1.75}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[12px] leading-snug text-text-secondary group-hover:text-text-primary">
                      {wf.name}
                    </span>
                    {wf.source === "ai" && i === 0 && (
                      <span className="mt-1 inline-block rounded-[4px] bg-accent-indigo/10 px-1.5 py-px text-[9px] font-semibold text-accent-indigo">
                        جدید
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {recentDashboards.length > 0 && (
          <div className="mt-5">
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.08em] text-text-muted">
              داشبوردها
            </p>
            <ul className="space-y-0.5">
              {recentDashboards.map((dash, i) => (
                <li key={dash.id}>
                  <Link
                    href={`/dashboards/${dash.id}`}
                    className="group flex items-start gap-2 rounded-[10px] px-2.5 py-1.5 transition-colors hover:bg-bg-subtle/70"
                  >
                    <LayoutDashboard
                      size={12}
                      className="mt-0.5 shrink-0 text-primary/70"
                      strokeWidth={1.75}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[12px] leading-snug text-text-secondary group-hover:text-text-primary">
                        {dash.name}
                      </span>
                      {i === 0 && (
                        <span className="mt-1 inline-block rounded-[4px] bg-primary/10 px-1.5 py-px text-[9px] font-semibold text-primary">
                          جدید
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5">
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.08em] text-text-muted">
            گفتگوها
          </p>
          <ul className="space-y-0.5">
            {sidebarConversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  className="block truncate rounded-[10px] px-2.5 py-1.5 text-[12px] text-text-tertiary transition-colors hover:bg-bg-subtle/70 hover:text-text-secondary"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 p-2.5 space-y-0.5">
        <button
          type="button"
          onClick={onOpenMore}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium transition-colors",
            moreActive
              ? "bg-primary/[0.08] text-primary ring-1 ring-primary/15"
              : "text-text-tertiary hover:bg-bg-subtle/70 hover:text-text-secondary"
          )}
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
          بیشتر
        </button>
        <button
          type="button"
          onClick={cycleTheme}
          aria-label="تغییر ظاهر"
          className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] text-text-muted transition-colors hover:bg-bg-subtle/70 hover:text-text-secondary"
        >
          {theme === "system" ? (
            <Sun size={16} strokeWidth={1.75} className="opacity-70" />
          ) : resolved === "dark" ? (
            <Moon size={16} strokeWidth={1.75} />
          ) : (
            <Sun size={16} strokeWidth={1.75} />
          )}
          {theme === "system"
            ? "سیستم"
            : resolved === "dark"
              ? "تیره"
              : "روشن"}
        </button>
      </div>
    </aside>
  );
}
