"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Stethoscope,
  Scan,
  Calendar,
  FileText,
  Activity,
  BookOpen,
  GitBranch,
  Zap,
  Wallet,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { spring } from "@/lib/motion";
import { dockItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  stethoscope: Stethoscope,
  scan: Scan,
  calendar: Calendar,
  "file-text": FileText,
  activity: Activity,
  book: BookOpen,
  "git-branch": GitBranch,
  zap: Zap,
  wallet: Wallet,
  sparkles: Sparkles,
  settings: Settings,
};

export function Dock() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "glass flex flex-col items-center gap-0.5 rounded-[var(--radius-2xl)] p-2",
        "scrollbar-none max-h-[calc(100vh-48px)] overflow-y-auto"
      )}
      aria-label="ناوبری اصلی"
    >
      {dockItems.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.id}
            href={item.href}
            className="group relative flex items-center justify-center"
            aria-current={isActive ? "page" : undefined}
            title={item.label}
          >
            <motion.div
              whileHover={{ scale: 1.06, transition: spring.gentle }}
              whileTap={{ scale: 0.94, transition: spring.snappy }}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)]",
                "transition-colors duration-[140ms]",
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-text-tertiary hover:bg-bg-subtle/80 hover:text-text-secondary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-[var(--radius-lg)] bg-primary/10"
                  transition={spring.soft}
                />
              )}
              {Icon && (
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  className="relative z-10"
                />
              )}
            </motion.div>

            {/* Tooltip on hover */}
            <span
              className={cn(
                "pointer-events-none absolute left-full mr-3 whitespace-nowrap",
                "rounded-[var(--radius-md)] glass-subtle px-3 py-1.5",
                "text-[var(--text-sm)] font-medium text-text-primary",
                "opacity-0 translate-x-2 transition-all duration-[180ms]",
                "group-hover:opacity-100 group-hover:translate-x-0"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
