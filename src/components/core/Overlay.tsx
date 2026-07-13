"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring, radius, drawerSlide, floatingPanel, timing } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
  title?: string;
  className?: string;
}

/** Side panel — NOT centered modal */
export function Drawer({
  open,
  onClose,
  children,
  side = "left",
  title,
  className,
}: DrawerProps) {
  const reduced = useReducedMotion();
  const slide = drawerSlide[side === "left" ? "left" : "right"];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.01 } : { duration: timing.drawer * 0.5 }}
            className="fixed inset-0 z-50 bg-text-primary/15 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={reduced ? { opacity: 0 } : slide.initial}
            animate={reduced ? { opacity: 1 } : slide.animate}
            exit={reduced ? { opacity: 0 } : slide.exit}
            className={cn(
              "fixed top-0 bottom-0 z-50 w-full max-w-md",
              "border-border bg-bg-elevated/95 backdrop-blur-md shadow-[var(--shadow-md)]",
              side === "left" ? "left-0 border-r" : "right-0 border-l",
              className
            )}
          >
            {title && (
              <header className="border-b border-border px-6 py-4">
                <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
              </header>
            )}
            <div className="overflow-y-auto h-full p-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingPanel({ children, className }: FloatingPanelProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={floatingPanel}
      className={cn(
        radius.lg,
        "border border-border bg-bg-elevated/90 backdrop-blur-md",
        "shadow-[var(--shadow-md)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface ToastProps {
  message: string;
  visible?: boolean;
  className?: string;
}

export function Toast({ message, visible, className }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.99, filter: "blur(2px)" }}
          transition={spring.gentle}
          className={cn(
            "fixed bottom-24 left-8 z-50 max-w-xs",
            radius.md,
            "border border-border bg-bg-elevated/95 backdrop-blur-sm px-4 py-2.5",
            "text-[13px] text-text-secondary shadow-[var(--shadow-sm)]",
            className
          )}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AvatarProps {
  name: string;
  src?: string;
  status?: "online" | "busy" | "offline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const avatarSizes = { sm: "h-8 w-8 text-[13px]", md: "h-10 w-10 text-[15px]", lg: "h-14 w-14 text-[20px]" };
const statusColors = { online: "bg-success", busy: "bg-warning", offline: "bg-text-tertiary" };

export function Avatar({ name, src, status, size = "md", className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn("rounded-[10px] object-cover", avatarSizes[size])}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-[10px] bg-primary/10 font-semibold text-primary",
            avatarSizes[size]
          )}
        >
          {name.charAt(0)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-elevated",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
