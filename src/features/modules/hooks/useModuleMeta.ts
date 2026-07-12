"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, QUERY_CONFIG } from "@/config";
import { modulesApi } from "@/services/api/modules";
import type { ModuleId } from "@/types";

export function useModuleMeta(moduleId: ModuleId) {
  return useQuery({
    queryKey: queryKeys.modules.meta(moduleId),
    queryFn: async () => {
      const response = await modulesApi.getMeta(moduleId);
      return response.data;
    },
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
  });
}
