"use client";

import { motion } from "framer-motion";
import type { VoiceAssistantState } from "@/mock/data/voice-assistant";
import { cn } from "@/lib/utils";

interface VoiceWaveformProps {
  active: boolean;
  volume: number;
  state: VoiceAssistantState;
}

const BARS = 36;
const ease = [0.45, 0, 0.55, 1] as const;

export function VoiceWaveform({ active, volume, state }: VoiceWaveformProps) {
  const speaking = state === "speaking";
  const thinking = state === "thinking";

  return (
    <div
      className={cn(
        "flex h-8 items-center justify-center gap-[2.5px]",
        thinking && "opacity-30"
      )}
      aria-hidden
    >
      {Array.from({ length: BARS }, (_, i) => {
        const center = (BARS - 1) / 2;
        const dist = Math.abs(i - center) / center;
        const envelope = Math.cos(dist * Math.PI * 0.5);
        const wave =
          active && !thinking
            ? 0.12 +
              envelope *
                (0.25 + volume * (0.55 + 0.35 * Math.sin(i * 0.48 + volume * 6)))
            : 0.08 + envelope * 0.06;
        const h = Math.max(2, Math.min(28, wave * 28));

        return (
          <motion.span
            key={i}
            animate={{
              height: thinking ? 2 : h,
              opacity: active ? 0.4 + volume * 0.5 : 0.22,
            }}
            transition={{ type: "tween", duration: 0.14, ease }}
            className={cn(
              "w-[1.5px] rounded-full",
              speaking ? "bg-white/70" : "bg-white/40"
            )}
          />
        );
      })}
    </div>
  );
}
