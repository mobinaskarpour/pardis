"use client";

import { AIButton } from "@/components/core/AIButton";
import { usePathname } from "next/navigation";

export function FloatingAI() {
  const pathname = usePathname();
  if (pathname === "/chat" || pathname === "/") return null;
  return <AIButton />;
}
