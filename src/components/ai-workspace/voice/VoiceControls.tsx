"use client";

import { Keyboard, Mic, MicOff, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceControlsProps {
  muted: boolean;
  micActive: boolean;
  onToggleMute: () => void;
  onMic: () => void;
  onEnd: () => void;
  onSwitchToText: () => void;
}

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

/**
 * Solid matte controls — each button owns its label for perfect alignment.
 */
export function VoiceControls({
  muted,
  micActive,
  onToggleMute,
  onMic,
  onEnd,
  onSwitchToText,
}: VoiceControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
      className="flex items-end justify-center gap-5 sm:gap-6"
    >
      <Control
        caption="میکروفون"
        ariaLabel={micActive && !muted ? "میکروفون فعال" : "میکروفون"}
        onClick={onMic}
        active={micActive && !muted}
        tone="primary"
      >
        <Mic size={22} strokeWidth={1.85} />
      </Control>

      <Control
        caption={muted ? "فعال‌سازی" : "قطع صدا"}
        ariaLabel={muted ? "فعال‌سازی میکروفون" : "قطع میکروفون"}
        onClick={onToggleMute}
        active={muted}
        tone="neutral"
      >
        <MicOff size={22} strokeWidth={1.85} />
      </Control>

      <Control
        caption="حالت متن"
        ariaLabel="رفتن به حالت متن"
        onClick={onSwitchToText}
        tone="neutral"
      >
        <Keyboard size={22} strokeWidth={1.85} />
      </Control>

      <Control
        caption="پایان"
        ariaLabel="پایان گفتگو"
        onClick={onEnd}
        tone="danger"
      >
        <PhoneOff size={20} strokeWidth={1.9} />
      </Control>
    </motion.div>
  );
}

function Control({
  children,
  caption,
  ariaLabel,
  onClick,
  active,
  tone,
}: {
  children: React.ReactNode;
  caption: string;
  ariaLabel: string;
  onClick: () => void;
  active?: boolean;
  tone: "primary" | "neutral" | "danger";
}) {
  return (
    <div className="flex w-[72px] flex-col items-center gap-2.5">
      <motion.button
        type="button"
        aria-label={ariaLabel}
        aria-pressed={active}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className={cn(
          "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
          "transition-[background-color,box-shadow,color] duration-200",
          tone === "danger" &&
            "bg-[#b35c5c] text-white shadow-[0_6px_18px_rgba(120,45,45,0.38),0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#c06868] hover:shadow-[0_10px_26px_rgba(120,45,45,0.45),0_3px_6px_rgba(0,0,0,0.22)]",
          tone === "primary" &&
            active &&
            "bg-[#4a7f9e] text-white shadow-[0_6px_20px_rgba(40,90,120,0.42),0_2px_4px_rgba(0,0,0,0.18)] hover:bg-[#5589a8] hover:shadow-[0_10px_28px_rgba(40,90,120,0.48),0_3px_6px_rgba(0,0,0,0.2)]",
          tone === "primary" &&
            !active &&
            "bg-[#343e4c] text-white/90 shadow-[0_5px_16px_rgba(0,0,0,0.32),0_1px_3px_rgba(0,0,0,0.18)] hover:bg-[#3d4858] hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.38),0_2px_5px_rgba(0,0,0,0.2)]",
          tone === "neutral" &&
            active &&
            "bg-[#3f4a5a] text-white shadow-[0_6px_18px_rgba(0,0,0,0.36),0_2px_4px_rgba(0,0,0,0.18)] hover:bg-[#485466]",
          tone === "neutral" &&
            !active &&
            "bg-[#343e4c] text-white/90 shadow-[0_5px_16px_rgba(0,0,0,0.32),0_1px_3px_rgba(0,0,0,0.18)] hover:bg-[#3d4858] hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.38),0_2px_5px_rgba(0,0,0,0.2)]"
        )}
      >
        {/* Soft top edge — matte, not glass */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full opacity-[0.12]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, transparent 100%)",
          }}
        />
        <motion.span
          className="relative z-[1] flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={spring}
        >
          {children}
        </motion.span>
      </motion.button>

      <p
        className={cn(
          "text-center text-[11px] font-semibold leading-tight tracking-wide",
          tone === "danger"
            ? "text-[#e8a0a0]"
            : active
              ? "text-white/80"
              : "text-white/55"
        )}
      >
        {caption}
      </p>
    </div>
  );
}
