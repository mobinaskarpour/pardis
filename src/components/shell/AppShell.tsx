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
}

export function AppShell({
  children,
  pageTitle,
  hideFloatingAI,
}: AppShellProps) {
  const { open, openPalette, closePalette } = useCommandPalette();

  return (
    <div className="flex h-screen overflow-hidden bg-bg bg-texture">
      {/* OS-style Dock */}
      <aside className="hidden md:flex flex-col w-[72px] shrink-0 border-l border-border bg-bg-elevated/40 backdrop-blur-sm">
        <Dock />
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar onSearchOpen={openPalette} pageTitle={pageTitle} />
        <main className="flex-1 min-h-0 overflow-hidden">
          <PageTransition className="h-full">{children}</PageTransition>
        </main>
      </div>

      <CommandPalette open={open} onClose={closePalette} />
      {!hideFloatingAI && <FloatingAI />}
    </div>
  );
}
