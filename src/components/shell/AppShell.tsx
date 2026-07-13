"use client";

import { Dock } from "./Dock";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { useCommandPalette } from "@/features/shell/hooks/useCommandPalette";
import { FloatingAI } from "./FloatingAI";
import { PageTransition } from "@/components/motion";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  hideFloatingAI?: boolean;
  immersive?: boolean;
}

export function AppShell({
  children,
  pageTitle,
  hideFloatingAI,
  immersive,
}: AppShellProps) {
  const { open, openPalette, closePalette } = useCommandPalette();

  return (
    <div className="relative min-h-screen bg-machine">
      <div className="bg-noise fixed inset-0 pointer-events-none" aria-hidden />

      {/* Floating dock */}
      <aside className="fixed top-1/2 right-4 z-40 hidden md:block -translate-y-1/2">
        <Dock />
      </aside>

      <div className="relative flex min-h-screen flex-col md:pr-[88px]">
        {!immersive && (
          <Topbar onSearchOpen={openPalette} pageTitle={pageTitle} />
        )}

        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <CommandPalette open={open} onClose={closePalette} />
      {!hideFloatingAI && <FloatingAI />}
    </div>
  );
}
