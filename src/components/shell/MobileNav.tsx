"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  primaryNavItems,
  moreNavItems,
  isPrimaryNavActive,
} from "@/config/navigation";
import { spring, timing } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenMore: () => void;
}

export function MobileNav({ open, onClose, onOpenMore }: MobileNavProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reduced ? { duration: 0.01 } : { duration: timing.drawer * 0.45 }
            }
            className="fixed inset-0 z-[60] bg-[#0f1114]/25 backdrop-blur-[4px] md:hidden"
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="منوی ناوبری"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={spring.drawer}
            className={cn(
              "fixed inset-y-0 right-0 z-[61] flex w-[min(100vw,320px)] flex-col md:hidden",
              "border-l border-white/60 bg-white/95 backdrop-blur-2xl",
              "shadow-[-16px_0_48px_rgba(17,19,24,0.12)]"
            )}
          >
            <header className="flex items-center justify-between border-b border-border/80 px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  THE MACHINE
                </p>
                <p className="text-[15px] font-semibold text-text-primary">
                  ناوبری
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-[12px] text-text-tertiary hover:bg-bg-subtle/80"
                aria-label="بستن"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-3">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                تجربه‌های اصلی
              </p>
              <div className="flex flex-col gap-1">
                {primaryNavItems.map((item) => {
                  const active = isPrimaryNavActive(pathname, item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-[14px] px-3 py-2.5",
                        active
                          ? "bg-primary/[0.08] text-primary"
                          : "text-text-secondary hover:bg-bg-subtle/70"
                      )}
                    >
                      <span className="text-[18px]" aria-hidden>
                        {item.emoji}
                      </span>
                      <span className="text-[14px] font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <p className="mb-2 mt-5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                بیشتر
              </p>
              <div className="grid grid-cols-2 gap-1">
                {moreNavItems.slice(0, 6).map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className="flex flex-col items-center gap-1 rounded-[14px] px-2 py-3 text-center hover:bg-bg-subtle/70"
                  >
                    <span className="text-[20px]" aria-hidden>
                      {item.emoji}
                    </span>
                    <span className="text-[11px] font-medium text-text-secondary">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMore();
                }}
                className="mt-2 w-full rounded-[14px] border border-border/80 px-3 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-bg-subtle/70"
              >
                مشاهده همه ماژول‌ها
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
