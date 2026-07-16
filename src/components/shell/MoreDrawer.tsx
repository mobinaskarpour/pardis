"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { moreNavItems } from "@/config/navigation";
import { spring, drawerSlide, timing } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MoreDrawer({ open, onClose }: MoreDrawerProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const slide = drawerSlide.right;

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
            className="fixed inset-0 z-[60] bg-[#0f1114]/20 backdrop-blur-[6px]"
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="ماژول‌های بیشتر"
            initial={reduced ? { opacity: 0 } : slide.initial}
            animate={reduced ? { opacity: 1 } : slide.animate}
            exit={reduced ? { opacity: 0 } : slide.exit}
            transition={spring.drawer}
            className={cn(
              "fixed top-3 bottom-3 right-3 z-[61] flex w-full max-w-[420px] flex-col overflow-hidden",
              "rounded-[24px] border border-white/60 bg-white/92 backdrop-blur-2xl",
              "shadow-[0_24px_80px_rgba(17,19,24,0.14),0_0_0_1px_rgba(17,19,24,0.04)]"
            )}
          >
            <header className="shrink-0 border-b border-border/80 px-6 pb-5 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    THE MACHINE
                  </p>
                  <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-text-primary">
                    ⋯ بیشتر
                  </h2>
                  <p className="mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-text-tertiary">
                    ابزارها و ماژول‌های پشتیبان — همه در خدمت چهار تجربه اصلی
                    پلتفرم
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-text-tertiary transition-colors hover:bg-bg-subtle/80 hover:text-text-secondary"
                  aria-label="بستن"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {moreNavItems.map((item, index) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduced ? 0 : 0.04 + index * 0.025,
                        ...spring.gentle,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center gap-3 rounded-[16px] px-3.5 py-3",
                          "transition-all duration-[160ms]",
                          active
                            ? "bg-primary/[0.08] ring-1 ring-primary/15"
                            : "hover:bg-bg-subtle/70"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[18px]",
                            active
                              ? "bg-white shadow-[0_2px_8px_rgba(17,19,24,0.06)]"
                              : "bg-bg-subtle/60 group-hover:bg-white group-hover:shadow-[0_2px_8px_rgba(17,19,24,0.05)]"
                          )}
                          aria-hidden
                        >
                          {item.emoji}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-[14px] font-medium",
                              active ? "text-primary" : "text-text-primary"
                            )}
                          >
                            {item.label}
                          </span>
                        </span>
                        <ArrowLeft
                          size={14}
                          strokeWidth={1.75}
                          className={cn(
                            "shrink-0 opacity-0 transition-all duration-[160ms]",
                            "-translate-x-1 group-hover:translate-x-0 group-hover:opacity-40",
                            active && "opacity-30"
                          )}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <footer className="shrink-0 border-t border-border/80 px-6 py-4">
              <p className="text-center text-[11px] leading-relaxed text-text-muted">
                مرکز فرمان · AI · ورک‌فلو · اتصالات
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
