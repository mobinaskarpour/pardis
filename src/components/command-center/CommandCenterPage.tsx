"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { SplashScreen } from "@/components/command-center/SplashScreen";
import { AISummary } from "@/components/command-center/AISummary";
import { AICore } from "@/components/command-center/AICore";
import { FloatingMetrics } from "@/components/command-center/FloatingMetrics";
import { QuickActions } from "@/components/command-center/QuickActions";
import { LiveTimeline } from "@/components/command-center/LiveTimeline";
import { AISuggestions } from "@/components/command-center/AISuggestions";
import { HealthStatus } from "@/components/command-center/HealthStatus";
import { IntegrationsStatus } from "@/components/command-center/IntegrationsStatus";
import { AIThinking } from "@/components/command-center/AIThinking";
import { spring } from "@/lib/motion";

export function CommandCenterPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [ready, setReady] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setReady(true), 100);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {!showSplash && (
        <AppShell>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 py-8 md:px-10 md:py-10"
          >
            {/* AI Summary */}
            <section className="mb-10">
              <AISummary />
              <div className="mt-4">
                <AIThinking />
              </div>
            </section>

            {/* Main grid — AI Core + Timeline */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8 xl:gap-12">
              {/* Center: AI Core + Floating Metrics */}
              <section className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.2, ...spring.hero }}
                  className="mb-8"
                >
                  <AICore onClick={() => router.push("/chat")} />
                </motion.div>

                <FloatingMetrics />
              </section>

              {/* Right: Live Timeline */}
              <aside className="xl:sticky xl:top-8 xl:self-start">
                <div className="rounded-[14px] border border-border bg-bg-elevated/60 backdrop-blur-sm p-5">
                  <LiveTimeline />
                </div>
              </aside>
            </div>

            {/* Bottom sections */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <QuickActions />
              </div>
              <HealthStatus />
              <IntegrationsStatus />
            </div>

            <div className="mt-8 max-w-xl">
              <AISuggestions />
            </div>
          </motion.div>
        </AppShell>
      )}
    </>
  );
}
