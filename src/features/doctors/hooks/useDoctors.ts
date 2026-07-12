"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, QUERY_CONFIG } from "@/config";
import { doctorsApi } from "@/services/api/doctors";

export function useDoctors() {
  return useQuery({
    queryKey: queryKeys.doctors.list(),
    queryFn: async () => {
      const response = await doctorsApi.list();
      return response.data;
    },
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: async () => {
      const response = await doctorsApi.getById(id);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
  });
}
