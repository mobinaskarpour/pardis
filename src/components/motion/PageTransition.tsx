"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition, variantsSafe } from "@/lib/motion";
import { useReducedMotion } from "./MotionProvider";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/** Fade + Blur + Translate on route change */
export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const variants = variantsSafe(reduced, pageTransition);

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Single element reveal — purposeful entrance */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={
        reduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={reduced ? { duration: 0.01 } : { delay, type: "spring", stiffness: 80, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function Stagger({ children, className, staggerDelay = 0.08 }: StaggerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={
        reduced
          ? { animate: { transition: { staggerChildren: 0 } } }
          : {
              animate: {
                transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
              },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={
        reduced
          ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
          : {
              initial: { opacity: 0, y: 8, filter: "blur(4px)" },
              animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
