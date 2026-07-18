import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DiscoveredDashboard } from "@/types/dashboard";

interface DashboardState {
  dashboards: DiscoveredDashboard[];
  addDashboard: (dashboard: DiscoveredDashboard) => void;
  hasDashboard: (id: string) => boolean;
  getDashboard: (id: string) => DiscoveredDashboard | undefined;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: [],
      addDashboard: (dashboard) =>
        set((state) =>
          state.dashboards.some((d) => d.id === dashboard.id)
            ? state
            : { dashboards: [dashboard, ...state.dashboards] }
        ),
      hasDashboard: (id) => get().dashboards.some((d) => d.id === id),
      getDashboard: (id) => get().dashboards.find((d) => d.id === id),
    }),
    {
      name: "pardis-dashboards-v1",
      skipHydration: true,
    }
  )
);
