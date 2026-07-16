"use client";

import { AppShell } from "@/components/shell/AppShell";
import { DynamicDashboard } from "./DynamicDashboard";

export function DashboardPage() {
  return (
    <AppShell dashboard>
      <DynamicDashboard />
    </AppShell>
  );
}
