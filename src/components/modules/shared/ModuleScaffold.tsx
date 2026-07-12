"use client";

import { AppShell } from "@/components/shell/AppShell";
import {
  ModuleHero,
  AIDock,
} from "@/components/modules/shared/ModuleShell";
import { moduleMeta } from "@/lib/modules-data";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { EmptyState } from "@/components/core";

interface ModuleScaffoldProps {
  moduleId: keyof typeof moduleMeta;
  children?: React.ReactNode;
}

export function ModuleScaffold({ moduleId, children }: ModuleScaffoldProps) {
  const meta = moduleMeta[moduleId];

  return (
    <AppShell pageTitle={meta.title}>
      <div className="h-full overflow-y-auto px-6 py-8 md:px-10 md:py-10">
        <ModuleHero
          title={meta.title}
          subtitle={meta.subtitle}
          aiSummary={meta.aiSummary}
        />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ...spring.soft }}
          >
            {children ?? (
              <EmptyState
                title={`${meta.title} — به‌زودی`}
                description="این ماژول در Demo بعدی تکمیل می‌شود. AI Dock و Quick Actions فعال هستند."
                suggestions={meta.suggestions}
              />
            )}
          </motion.div>

          <AIDock
            suggestions={meta.suggestions}
            quickActions={meta.quickActions}
          />
        </div>
      </div>
    </AppShell>
  );
}
