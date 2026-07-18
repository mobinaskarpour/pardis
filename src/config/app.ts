/** Application-wide constants — no magic numbers in components */
export const APP_NAME = "THEMACHINE";

export const API_CONFIG = {
  /** Simulated network latency for mock API (ms) */
  mockDelayMs: 350,
  /** Default page size for list endpoints */
  defaultPageSize: 20,
} as const;

export const QUERY_CONFIG = {
  staleTime: 60_000,
  gcTime: 300_000,
  retry: 1,
} as const;
