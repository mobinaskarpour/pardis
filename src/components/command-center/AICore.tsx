"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { spring, cardHover, cardTap, breathe } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/motion";

interface AICoreProps {
  onClick?: () => void;
  className?: string;
}

export function AICore({ onClick, className }: AICoreProps) {
  const reduced = useReducedMotion();
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    else router.push("/chat");
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-muted",
        className
      )}
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0 0 24px rgba(61, 107, 140, 0.12)",
              transition: spring.gentle,
            }
      }
      whileTap={reduced ? undefined : cardTap}
      aria-label="باز کردن فضای کار هوش مصنوعی"
    >
      <motion.div
        className="absolute h-[200px] w-[200px] rounded-full border border-border"
        animate={reduced ? {} : breathe.animate}
        transition={breathe.transition}
      />

      <motion.div
        className="absolute h-[160px] w-[160px] rounded-full border border-border-strong bg-bg-elevated/50"
        animate={reduced ? {} : { scale: [1, 1.02, 1] }}
        transition={{ ...spring.hero, duration: 4, repeat: Infinity, delay: 0.5 }}
      />

      <motion.div
        className="relative h-[120px] w-[120px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-bg-elevated border border-border-hover"
        animate={reduced ? {} : { scale: [1, 1.035, 1] }}
        transition={{ ...spring.hero, duration: 4, repeat: Infinity }}
      >
        {!reduced && <div className="absolute inset-0 rounded-full bg-primary/5 animate-breathe" />}
        <div className="absolute inset-[30%] rounded-full bg-primary/30 blur-sm" />
        <div className="absolute inset-[40%] rounded-full bg-primary/50" />
      </motion.div>

      <motion.span
        className="absolute -bottom-10 text-[13px] font-medium text-text-tertiary"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, ...spring.soft }}
      >
        The Machine
      </motion.span>
    </motion.button>
  );
}
