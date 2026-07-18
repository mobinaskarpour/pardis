"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { MoreDrawer } from "./MoreDrawer";
import { MobileNav } from "./MobileNav";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { useCommandPalette } from "@/features/shell/hooks/useCommandPalette";
import { FloatingAI } from "./FloatingAI";
import { PageTransition } from "@/components/motion";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  hideFloatingAI?: boolean;
  immersive?: boolean;
  dashboard?: boolean;
}

export function AppShell({
  children,
  pageTitle,
  hideFloatingAI,
  immersive,
  dashboard: dashboardProp,
}: AppShellProps) {
  const pathname = usePathname();
  const isDashboard = dashboardProp ?? pathname === "/";
  const { open, openPalette, closePalette } = useCommandPalette();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const openMore = useCallback(() => setMoreOpen(true), []);
  const closeMore = useCallback(() => setMoreOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePalette();
        setMoreOpen(false);
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePalette]);

  if (immersive) {
    return <>{children}</>;
  }

  const shellOverlays = (
    <>
      <CommandPalette open={open} onClose={closePalette} />
      <MoreDrawer open={moreOpen} onClose={closeMore} />
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenMore={openMore}
      />
    </>
  );

  if (isDashboard) {
    return (
      <div className="flex h-screen overflow-hidden bg-bg-layer-2">
        <div className="bg-noise fixed inset-0 pointer-events-none" aria-hidden />

        <div className="hidden md:flex shrink-0 h-full">
          <AppSidebar onOpenMore={openMore} />
        </div>

        <main className="relative flex-1 min-w-0 overflow-hidden py-3 pe-3">
          <div className="h-full overflow-hidden rounded-[var(--radius-xl)] border border-border/70 bg-bg-elevated shadow-[var(--shadow-sm)]">
            <PageTransition>
              {isValidElement(children)
                ? cloneElement(children, {
                    onOpenMenu: () => setMobileNavOpen(true),
                    onOpenSearch: openPalette,
                  } as Record<string, unknown>)
                : children}
            </PageTransition>
          </div>
        </main>

        {shellOverlays}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-machine">
      <div className="bg-noise fixed inset-0 pointer-events-none" aria-hidden />

      <div className="hidden md:flex fixed inset-y-0 start-0 z-40">
        <AppSidebar onOpenMore={openMore} />
      </div>

      <div
        className={cn(
          "relative flex min-h-screen flex-col",
          "md:ps-[calc(var(--sidebar-width)+1.25rem)]"
        )}
      >
        <Topbar
          onSearchOpen={openPalette}
          onMenuOpen={() => setMobileNavOpen(true)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 pe-3 pb-3">
          <div className="min-h-[calc(100vh-4.5rem)] rounded-[var(--radius-xl)] border border-border/60 bg-bg-elevated/50 shadow-[var(--shadow-sm)]">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>

      {shellOverlays}
      {!hideFloatingAI && <FloatingAI />}
    </div>
  );
}
