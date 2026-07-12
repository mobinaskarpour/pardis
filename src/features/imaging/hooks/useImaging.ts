"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, QUERY_CONFIG } from "@/config";
import { imagingApi } from "@/services/api/imaging";

export function useImagingStudies(filter?: string) {
  return useQuery({
    queryKey: queryKeys.imaging.list(filter),
    queryFn: async () => {
      const response = await imagingApi.list(filter);
      return response.data;
    },
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
  });
}

export function useImagingStudy(id: string) {
  return useQuery({
    queryKey: queryKeys.imaging.detail(id),
    queryFn: async () => {
      const response = await imagingApi.getById(id);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
  });
}

export function useImagingDevices() {
  return useQuery({
    queryKey: queryKeys.imaging.devices(),
    queryFn: async () => {
      const response = await imagingApi.getDevices();
      return response.data;
    },
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
  });
}
