import type { ModuleId } from "@/types";

/** Centralized TanStack Query keys */
export const queryKeys = {
  patients: {
    all: ["patients"] as const,
    lists: () => [...queryKeys.patients.all, "list"] as const,
    list: (filter?: string) =>
      [...queryKeys.patients.lists(), { filter: filter ?? "" }] as const,
    details: () => [...queryKeys.patients.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
  },
  doctors: {
    all: ["doctors"] as const,
    lists: () => [...queryKeys.doctors.all, "list"] as const,
    list: () => [...queryKeys.doctors.lists()] as const,
    details: () => [...queryKeys.doctors.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.doctors.details(), id] as const,
  },
  modules: {
    all: ["modules"] as const,
    meta: (id: ModuleId) => [...queryKeys.modules.all, "meta", id] as const,
  },
  imaging: {
    all: ["imaging"] as const,
    lists: () => [...queryKeys.imaging.all, "list"] as const,
    list: (filter?: string) =>
      [...queryKeys.imaging.lists(), { filter: filter ?? "" }] as const,
    detail: (id: string) => [...queryKeys.imaging.all, "detail", id] as const,
    devices: () => [...queryKeys.imaging.all, "devices"] as const,
  },
  commandCenter: {
    all: ["command-center"] as const,
    summary: () => [...queryKeys.commandCenter.all, "summary"] as const,
    metrics: () => [...queryKeys.commandCenter.all, "metrics"] as const,
    timeline: () => [...queryKeys.commandCenter.all, "timeline"] as const,
  },
  user: {
    current: () => ["user", "current"] as const,
  },
} as const;
