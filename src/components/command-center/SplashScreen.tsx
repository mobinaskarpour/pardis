"use client";

import { motion } from "framer-motion";
import { spring, duration } from "@/lib/motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.page, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2800);
      }}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, ...spring.hero }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ type: "tween", duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border-strong bg-bg-elevated"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ type: "tween", duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-6 w-6 rounded-full bg-primary/80 animate-pulse-soft" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, ...spring.soft }}
          className="text-center"
        >
          <h1 className="text-[13px] font-medium tracking-[0.2em] text-text-tertiary uppercase">
            THE MACHINE
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            مرکز تصویربرداری پردیس نور
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
