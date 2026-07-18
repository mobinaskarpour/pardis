"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { VoiceOrb } from "./VoiceOrb";
import { VoiceControls } from "./VoiceControls";
import { VoiceWaveform } from "./VoiceWaveform";
import { cn } from "@/lib/utils";

interface VoiceAssistantOverlayProps {
  open: boolean;
  onClose: () => void;
  onSubmitQuery: (query: string) => void;
  onSwitchToText: () => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;
const ENTER = { type: "tween" as const, duration: 0.46, ease: EASE };
const EXIT = { type: "tween" as const, duration: 0.36, ease: EASE };

/**
 * THEMACHINE Voice Mode — living AI Core experience.
 */
export function VoiceAssistantOverlay({
  open,
  onClose,
  onSubmitQuery,
  onSwitchToText,
}: VoiceAssistantOverlayProps) {
  const {
    state,
    volume,
    muted,
    transcript,
    aiSpeech,
    statusLabel,
    toggleMute,
    endConversation,
    switchToText,
    restartListening,
  } = useVoiceAssistant({
    open,
    onSubmitQuery,
    onClose,
    onSwitchToText,
  });

  if (typeof document === "undefined") return null;

  const micActive = !muted && (state === "listening" || state === "idle");

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="voice-ai-core"
          role="dialog"
          aria-modal="true"
          aria-label="هسته صوتی THEMACHINE"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={ENTER}
          className="fixed inset-0 z-[100]"
        >
          {/* Premium blur — app stays visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={ENTER}
            className="absolute inset-0 bg-[#081018]/42 backdrop-blur-[22px] supports-[backdrop-filter]:bg-[#081018]/32"
            onClick={endConversation}
            aria-hidden
          />

          {/* Cinematic depth: radial light + vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 48% 42% at 50% 38%, rgba(90,170,200,0.22) 0%, rgba(42,86,118,0.1) 42%, transparent 68%)",
                "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(0,0,0,0.45) 0%, transparent 55%)",
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,0,0,0.28) 0%, transparent 45%)",
                "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 25%)",
              ].join(","),
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={ENTER}
            className="relative z-10 flex h-full flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-9 sm:pt-11">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...ENTER, delay: 0.08 }}
                className="text-[10px] font-semibold tracking-[0.3em] text-white/28"
              >
                THEMACHINE
              </motion.p>
            </div>

            <div className="flex flex-1 flex-col items-center px-6">
              <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center pb-[8vh] pt-[1vh]">
                <div className="-translate-y-[4vh] flex w-full flex-col items-center">
                  <VoiceOrb
                    state={state}
                    volume={muted ? 0 : volume}
                    onActivate={restartListening}
                  />

                  <div className="mt-2 w-full max-w-[240px]">
                    <VoiceWaveform
                      active={
                        !muted &&
                        (state === "listening" || state === "speaking")
                      }
                      volume={volume}
                      state={state}
                    />
                  </div>

                  <div className="mt-5 flex min-h-[24px] items-center justify-center gap-2">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={statusLabel}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={EXIT}
                        className="text-[13px] font-medium tracking-wide text-white/48"
                      >
                        {statusLabel}
                      </motion.p>
                    </AnimatePresence>
                    {state === "thinking" && (
                      <span className="flex gap-1" aria-hidden>
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-[3px] w-[3px] rounded-full bg-white/40"
                            animate={{ opacity: [0.2, 0.9, 0.2] }}
                            transition={{
                              type: "tween",
                              duration: 1.3,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: [0.45, 0, 0.55, 1],
                            }}
                          />
                        ))}
                      </span>
                    )}
                  </div>

                  <div className="mt-8 w-full max-w-md px-4 text-center">
                    <AnimatePresence mode="wait">
                      {transcript ? (
                        <motion.p
                          key="transcript"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={ENTER}
                          className={cn(
                            "text-balance text-[20px] font-medium leading-[1.9] tracking-wide text-white/90",
                            "sm:text-[22px]"
                          )}
                        >
                          {transcript}
                          {state === "listening" && (
                            <motion.span
                              animate={{ opacity: [0.12, 0.65, 0.12] }}
                              transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                ease: [0.45, 0, 0.55, 1],
                              }}
                              className="ms-1 inline-block text-white/35"
                            >
                              ▍
                            </motion.span>
                          )}
                        </motion.p>
                      ) : (
                        <motion.p
                          key="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[13px] font-medium tracking-wide text-white/22"
                        >
                          صحبت با هسته هوشمند مرکز
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {aiSpeech && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={ENTER}
                          className="mx-auto mt-7 max-w-sm text-[13px] leading-[1.95] text-white/42"
                        >
                          {aiSpeech}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 pb-10 pt-2 sm:pb-12">
              <VoiceControls
                muted={muted}
                micActive={micActive}
                onToggleMute={toggleMute}
                onMic={restartListening}
                onEnd={endConversation}
                onSwitchToText={switchToText}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
