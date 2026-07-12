import type { Transition, Variants } from "framer-motion";

/** Part 08 — Motion System timing (seconds) */
export const timing = {
  hover: 0.12,
  click: 0.18,
  cardExpand: 0.25,
  drawer: 0.3,
  page: 0.45,
  hero: 0.7,
  background: 1.2,
} as const;

/** Spring presets — Linear & ease-in-out forbidden */
export const spring = {
  gentle: { type: "spring", stiffness: 120, damping: 20 } as Transition,
  soft: { type: "spring", stiffness: 80, damping: 18 } as Transition,
  snappy: { type: "spring", stiffness: 200, damping: 25 } as Transition,
  hero: { type: "spring", stiffness: 60, damping: 16 } as Transition,
  drawer: { type: "spring", stiffness: 100, damping: 22 } as Transition,
  panel: { type: "spring", stiffness: 90, damping: 20 } as Transition,
};

/** Legacy alias map */
export const duration = timing;

/** Page: Fade + Blur + Translate — no harsh slide */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...spring.soft, duration: timing.page },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: "blur(4px)",
    transition: { ...spring.gentle, duration: timing.page * 0.6 },
  },
};

/** Hero entrance — appears first, others follow */
export const heroEntrance: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...spring.hero, duration: timing.hero },
  },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring.soft,
  },
  exit: { opacity: 0, y: -4, filter: "blur(2px)", transition: spring.gentle },
};

export const fadeSlide: Variants = {
  initial: { opacity: 0, x: -8, filter: "blur(3px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: spring.soft },
  exit: { opacity: 0, x: 8, filter: "blur(2px)", transition: spring.gentle },
};

/** Command Palette — soft zoom */
export const commandPalette: Variants = {
  initial: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: spring.panel,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { ...spring.gentle, duration: timing.click },
  },
};

/** Floating panel — blur + fade + scale together */
export const floatingPanel: Variants = {
  initial: { opacity: 0, scale: 0.97, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: spring.panel },
  exit: { opacity: 0, scale: 0.98, filter: "blur(4px)", transition: spring.gentle },
};

/** Drawer — 300ms spring */
export const drawerSlide = {
  left: {
    initial: { x: -320, opacity: 0.8, filter: "blur(4px)" },
    animate: { x: 0, opacity: 1, filter: "blur(0px)", transition: spring.drawer },
    exit: { x: -320, opacity: 0.8, filter: "blur(4px)", transition: spring.drawer },
  },
  right: {
    initial: { x: 320, opacity: 0.8, filter: "blur(4px)" },
    animate: { x: 0, opacity: 1, filter: "blur(0px)", transition: spring.drawer },
    exit: { x: 320, opacity: 0.8, filter: "blur(4px)", transition: spring.drawer },
  },
};

/** Card interactions */
export const cardHover = { y: -2, transition: spring.gentle };
export const cardTap = { scale: 0.98, transition: spring.snappy };

/** Stagger containers */
export const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  },
  item: fadeUp,
  fast: {
    animate: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  },
  timeline: {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  },
  workspace: {
    animate: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  },
  emptyState: {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
};

/** Chart — data forming, not drawing from zero */
export const chartForm = (delay = 0): Transition => ({
  ...spring.soft,
  delay,
  duration: timing.hero,
});

/** Multi-keyframe loops — must use tween, not spring (FM 12 limit) */
export const loopTween = {
  type: "tween" as const,
  duration: 4,
  repeat: Infinity,
  ease: [0.45, 0, 0.55, 1] as const,
};

/** AI Core idle breathe keyframes */
export const breathe = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.85, 1, 0.85],
  },
  transition: loopTween,
};

/** Theme switch ~300ms */
export const themeSwitch = {
  transition: { ...spring.drawer, duration: timing.drawer },
};

/** Success — brief, no popup */
export const successPulse = {
  scale: [1, 1.02, 1],
  transition: { type: "tween" as const, duration: timing.click, ease: "easeOut" },
};

/** Error — calm, no shake */
export const errorReveal: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: spring.gentle },
};

/** Parallax cap */
export const PARALLAX_MAX = 3;

/** Reduce motion fallback */
export function motionSafe(
  reduced: boolean,
  transition: Transition,
  instant = { duration: 0.01 } as Transition
): Transition {
  return reduced ? instant : transition;
}

export function variantsSafe(
  reduced: boolean,
  variants: Variants
): Variants {
  if (!reduced) return variants;
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.01 } },
    exit: { opacity: 0, transition: { duration: 0.01 } },
  };
}

/** Card radius tokens */
export const radius = {
  sm: "rounded-[6px]",
  md: "rounded-[10px]",
  lg: "rounded-[14px]",
  xl: "rounded-[18px]",
  "2xl": "rounded-[24px]",
} as const;

export const interactive = {
  hover:
    "transition-all duration-[120ms] hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[var(--shadow-sm)]",
  focus:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  disabled:
    "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
};
