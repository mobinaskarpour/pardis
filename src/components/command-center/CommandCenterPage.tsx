"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { LivingCore } from "@/components/command-center/LivingCore";
import { CommandInput } from "@/components/command-center/CommandInput";
import { NarrativeBrief } from "@/components/command-center/NarrativeBrief";
import { ActivityRiver } from "@/components/command-center/ActivityRiver";
import { JourneyTimeline } from "@/components/command-center/JourneyTimeline";
import { DynamicSurface } from "@/components/command-center/DynamicSurface";
import { useCommandCenter } from "@/hooks/useCommandCenter";
import { user } from "@/lib/mock-data";
import { spring } from "@/lib/motion";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "صبح بخیر";
  if (hour < 17) return "ظهر بخیر";
  return "عصر بخیر";
}

export function CommandCenterPage() {
  const {
    mode,
    query,
    response,
    canvas,
    suggestedQuestions,
    thinking,
    submitQuery,
    onThinkingComplete,
    reset,
  } = useCommandCenter();

  const isIdle = mode === "idle";
  const isActive = mode === "active";

  return (
    <AppShell immersive>
      <div className="relative">
        {/* Hero — full viewport, chat-first */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring.hero}
          className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16 md:px-12"
        >
          {/* Ambient glow — not on top of text */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
          >
            <div className="absolute left-1/2 top-[38%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[100px]" />
          </div>

          <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
            {/* Core above text — in document flow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, ...spring.soft }}
              className="mb-6"
            >
              <LivingCore
                active={thinking || isActive}
                size="sm"
                variant="ambient"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, ...spring.soft }}
              className="mb-2 text-[var(--text-body-lg)] text-text-tertiary"
            >
              {getGreeting()} {user.name}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, ...spring.hero }}
              className="mb-8 max-w-lg text-[clamp(28px,5vw,40px)] font-semibold leading-[1.25] tracking-tight text-text-primary"
            >
              امروز چه کاری انجام دهیم؟
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, ...spring.soft }}
              className="w-full"
            >
              <CommandInput
                onSubmit={submitQuery}
                disabled={thinking}
                suggestions={isIdle ? suggestedQuestions : []}
              />
            </motion.div>

            {isActive && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="button"
                onClick={reset}
                className="mt-5 inline-flex items-center gap-1.5 text-[var(--text-sm)] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                بازگشت به مرکز فرمان
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* Dynamic surface — page responds to AI */}
        {mode !== "idle" && (
          <div className="px-6 pb-12 md:px-12 lg:px-16">
            <DynamicSurface
              mode={mode}
              canvas={canvas}
              response={response}
              query={query}
              thinking={thinking}
              onThinkingComplete={onThinkingComplete}
              onSuggestionClick={submitQuery}
            />

            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...spring.soft }}
                className="mx-auto mt-8 max-w-6xl"
              >
                <JourneyTimeline
                  filter={
                    canvas === "patients-today"
                      ? "بیمار"
                      : canvas === "mri-ready"
                        ? "MRI"
                        : canvas === "patient"
                          ? "احمدی"
                          : null
                  }
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Idle — narrative below the fold */}
        {isIdle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto max-w-6xl space-y-8 px-6 pb-20 md:px-12 lg:px-16"
          >
            <NarrativeBrief />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <ActivityRiver />
              </div>
              <div className="lg:col-span-2">
                <JourneyTimeline compact />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
