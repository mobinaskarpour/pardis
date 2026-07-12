"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { PARALLAX_MAX } from "@/lib/motion";
import { useReducedMotion } from "./MotionProvider";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Desktop mouse parallax — max 3px */
export function ParallaxLayer({
  children,
  className,
  strength = 1,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });
  const translateX = useTransform(x, (v) => v);
  const translateY = useTransform(y, (v) => v);

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    x.set(Math.max(-PARALLAX_MAX, Math.min(PARALLAX_MAX, dx * PARALLAX_MAX * strength)));
    y.set(Math.max(-PARALLAX_MAX, Math.min(PARALLAX_MAX, dy * PARALLAX_MAX * strength)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced || !enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: translateX, y: translateY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
