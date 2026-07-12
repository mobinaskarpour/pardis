"use client";

import { MotionProvider } from "@/components/motion";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <MotionProvider>{children}</MotionProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
