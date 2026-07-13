"use client";

import { useEffect } from "react";
import { MotionProvider } from "@/components/motion";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { useWorkflowStore } from "@/store/workflow-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useWorkflowStore.persist.rehydrate();
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider>
        <MotionProvider>{children}</MotionProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
