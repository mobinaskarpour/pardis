"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { moreNavItems } from "@/config/navigation";
import { spring, timing } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
}

const exitEase = [0.32, 0.72, 0, 1] as const;

export function MoreDrawer({ open, onClose }: MoreDrawerProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="more-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reduced
                ? { duration: 0.01 }
                : { type: "tween", duration: timing.drawer * 0.45, ease: exitEase }
            }
            className="fixed inset-0 z-[60] bg-text-primary/20 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="more-panel"
            role="dialog"
            aria-modal="true"
            aria-label="ماژول‌های بیشتر"
            initial={reduced ? { opacity: 0 } : { x: "-110%", opacity: 0.85 }}
            animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.01 } }
                : {
                    x: "-110%",
                    opacity: 0,
                    transition: {
                      type: "tween",
                      duration: timing.drawer,
                      ease: exitEase,
                    },
                  }
            }
            transition={
              reduced
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 280, damping: 32, mass: 0.9 }
            }
            className={cn(
              "fixed top-3 bottom-3 end-3 z-[61] flex w-full max-w-[400px] flex-col overflow-hidden",
              "rounded-[var(--radius-xl)] border border-border bg-bg-elevated",
              "shadow-[var(--shadow-lg)]"
            )}
          >
            <header className="shrink-0 border-b border-border px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-text-muted">
                    THEMACHINE
                  </p>
                  <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-text-primary">
                    ماژول‌های بیشتر
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

            <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-none">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
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
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[16px]",
                            active
                              ? "bg-bg-elevated shadow-[var(--shadow-sm)]"
                              : "bg-bg-subtle group-hover:bg-bg-elevated group-hover:shadow-[var(--shadow-sm)]"
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
              <p className="text-center text-[11px] leading-relaxed text-text-tertiary">
                مرکز فرمان · گفتگو · ورک‌فلو · اتصالات
              </p>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
