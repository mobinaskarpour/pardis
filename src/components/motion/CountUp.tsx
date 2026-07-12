"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { spring, timing } from "@/lib/motion";
import { useReducedMotion } from "./MotionProvider";
import { toPersianDigits } from "@/lib/persian";

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

/** Numbers count up slowly — Part 08 */
export function CountUp({
  value,
  duration = timing.hero,
  suffix = "",
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration, reduced]);

  return (
    <motion.span
      className={className}
      key={value}
      initial={reduced ? false : { opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={spring.soft}
    >
      {toPersianDigits(display)}
      {suffix}
    </motion.span>
  );
}
