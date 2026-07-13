"use client";

import { motion } from "framer-motion";
import { breathe, loopTween } from "@/lib/motion";

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 25 + Math.random() * 50,
  y: 25 + Math.random() * 50,
  size: 1 + Math.random() * 1.5,
  delay: Math.random() * 4,
}));

interface LivingCoreProps {
  active?: boolean;
  size?: "sm" | "lg";
  variant?: "default" | "ambient";
}

export function LivingCore({
  active,
  size = "lg",
  variant = "default",
}: LivingCoreProps) {
  const dim = size === "lg" ? 200 : 88;
  const isAmbient = variant === "ambient";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dim, height: dim }}
      aria-hidden
    >
      {/* Outer glow */}
      <motion.div
        animate={
          active
            ? { scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }
            : breathe.animate
        }
        transition={loopTween}
        className="absolute inset-0 rounded-full"
        style={{
          background: isAmbient
            ? "radial-gradient(circle, var(--primary-glow) 0%, transparent 65%)"
            : "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)",
          opacity: isAmbient ? 0.5 : 1,
        }}
      />

      {/* Soft rings — fewer in ambient mode */}
      {(isAmbient ? [1, 0.65] : [1, 0.75, 0.5]).map((scale, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [scale, scale * 1.03, scale],
            opacity: [0.08 - i * 0.02, 0.15 - i * 0.03, 0.08 - i * 0.02],
          }}
          transition={{ ...loopTween, delay: i * 0.8 }}
          className="absolute rounded-full border border-primary/8"
          style={{
            width: dim * scale,
            height: dim * scale,
          }}
        />
      ))}

      {/* Core */}
      <motion.div
        animate={breathe.animate}
        transition={loopTween}
        className="relative rounded-full"
        style={{
          width: dim * (isAmbient ? 0.42 : 0.35),
          height: dim * (isAmbient ? 0.42 : 0.35),
          background: isAmbient
            ? "radial-gradient(circle at 40% 35%, #7ec8d8 0%, var(--primary) 55%, #1e4a66 100%)"
            : "radial-gradient(circle at 35% 35%, var(--accent-cyan) 0%, var(--primary) 60%, var(--primary-muted) 100%)",
          boxShadow: isAmbient
            ? "0 0 24px var(--primary-glow), 0 0 48px var(--primary-soft)"
            : "0 0 40px var(--primary-glow), 0 0 80px var(--primary-soft)",
        }}
      />

      {/* Particles — subtle */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            x: [0, (Math.random() - 0.5) * 6, 0],
            y: [0, (Math.random() - 0.5) * 6, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            ...loopTween,
            delay: p.delay,
            duration: 6 + Math.random() * 4,
          }}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      {!isAmbient && (
        <svg
          className="absolute inset-0 h-full w-full opacity-15"
          viewBox="0 0 100 100"
        >
          <motion.line
            x1="50" y1="50" x2="30" y2="25"
            stroke="var(--primary)"
            strokeWidth="0.3"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ ...loopTween, delay: 0 }}
          />
          <motion.line
            x1="50" y1="50" x2="72" y2="30"
            stroke="var(--primary)"
            strokeWidth="0.3"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ ...loopTween, delay: 1.2 }}
          />
        </svg>
      )}
    </div>
  );
}
