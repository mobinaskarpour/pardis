"use client";

import { useEffect } from "react";
import { useThemeStore, resolveTheme } from "@/store/theme-store";
import { themeSwitch } from "@/lib/motion";

/** Applies dark/light class on html — dedicated dark design tokens */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const resolved = resolveTheme(theme);

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.setProperty(
      "--theme-transition",
      `${themeSwitch.transition.duration ?? 0.3}s`
    );

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      root.classList.remove("light", "dark");
      root.classList.add(resolveTheme("system"));
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return children;
}
