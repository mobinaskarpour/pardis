"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; meta?: boolean } = { ctrl: true }
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrlOrMeta = modifiers.ctrl
        ? e.ctrlKey || e.metaKey
        : modifiers.meta
          ? e.metaKey
          : false;

      if (ctrlOrMeta && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, modifiers.ctrl, modifiers.meta]);
}
