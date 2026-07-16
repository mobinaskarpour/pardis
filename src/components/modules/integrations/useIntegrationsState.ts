"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { ConnectionStatus, IntegrationRuntime } from "@/types/integration";
import {
  integrationsMock,
  initIntegrationRuntime,
} from "@/mock/data/integrations";

const SYNC_DELAY_MS = 1800;

export function useIntegrationsState() {
  const [runtime, setRuntime] = useState<Record<string, IntegrationRuntime>>(
    initIntegrationRuntime
  );
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const clearTimer = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  const enableIntegration = useCallback(
    (id: string) => {
      const item = integrationsMock.find((i) => i.id === id);
      if (!item) return;

      clearTimer(id);

      const targetStatus: ConnectionStatus =
        item.status === "disconnected" ? "syncing" : item.status;

      setRuntime((prev) => ({
        ...prev,
        [id]: {
          enabled: true,
          status: targetStatus,
          lastSync:
            targetStatus === "syncing" ? "در حال اتصال..." : item.lastSync,
        },
      }));

      if (targetStatus === "syncing") {
        const timer = setTimeout(() => {
          setRuntime((prev) => ({
            ...prev,
            [id]: {
              enabled: true,
              status: "connected",
              lastSync: "همین الان",
            },
          }));
          timersRef.current.delete(id);
        }, SYNC_DELAY_MS);
        timersRef.current.set(id, timer);
      }
    },
    [clearTimer]
  );

  const disableIntegration = useCallback(
    (id: string) => {
      clearTimer(id);
      setRuntime((prev) => ({
        ...prev,
        [id]: { enabled: false, status: "disabled", lastSync: undefined },
      }));
    },
    [clearTimer]
  );

  const toggleIntegration = useCallback(
    (id: string) => {
      const state = runtime[id];
      if (state?.enabled) {
        disableIntegration(id);
      } else {
        enableIntegration(id);
      }
    },
    [runtime, enableIntegration, disableIntegration]
  );

  const integrations = useMemo(() => integrationsMock, []);

  return {
    integrations,
    runtime,
    toggleIntegration,
    enableIntegration,
    disableIntegration,
  };
}
