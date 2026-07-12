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
      className="flex flex-col items-center gap-1 py-4 px-2 overflow-y-auto max-h-screen"
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
            className="group relative flex flex-col items-center shrink-0"
            aria-current={isActive ? "page" : undefined}
          >
            <motion.div
              whileHover={{ y: -2, transition: spring.gentle }}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-[10px]",
                "border transition-colors duration-[120ms]",
                isActive
                  ? "border-border-hover bg-bg-elevated text-primary"
                  : "border-transparent text-text-tertiary hover:border-border hover:bg-bg-elevated/60 hover:text-text-secondary"
              )}
            >
              {Icon && <Icon size={20} strokeWidth={1.75} />}
            </motion.div>

            <span
              className={cn(
                "mt-1 text-[11px] font-medium translate-y-0.5 opacity-0",
                "transition-all duration-[120ms] delay-[40ms]",
                "group-hover:opacity-100 group-hover:translate-y-0",
                isActive ? "text-primary opacity-100 translate-y-0" : "text-text-tertiary"
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
