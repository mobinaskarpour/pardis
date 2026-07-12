"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, QUERY_CONFIG } from "@/config";
import { patientsApi } from "@/services/api/patients";

export function usePatients(filter?: string) {
  return useQuery({
    queryKey: queryKeys.patients.list(filter),
    queryFn: async () => {
      const response = await patientsApi.list(filter);
      return response.data;
    },
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id),
    queryFn: async () => {
      const response = await patientsApi.getById(id);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
  });
}
