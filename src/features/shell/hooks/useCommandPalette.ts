"use client";

import { useCallback } from "react";
import { useNavigationStore } from "@/store";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export function useCommandPalette() {
  const open = useNavigationStore((s) => s.commandPaletteOpen);
  const openCommandPalette = useNavigationStore((s) => s.openCommandPalette);
  const closeCommandPalette = useNavigationStore((s) => s.closeCommandPalette);

  const openPalette = useCallback(() => openCommandPalette(), [openCommandPalette]);
  const closePalette = useCallback(() => closeCommandPalette(), [closeCommandPalette]);

  useKeyboardShortcut("k", openPalette);

  return { open, openPalette, closePalette };
}
