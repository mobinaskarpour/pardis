export type IntegrationCategoryId =
  | "medical"
  | "ai"
  | "patient"
  | "business"
  | "security";

export type ConnectionStatus =
  | "connected"
  | "syncing"
  | "needs_attention"
  | "disconnected"
  | "update_available"
  | "disabled";

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategoryId;
  /** Initial status when enabled */
  status: ConnectionStatus;
  lastSync?: string;
  version?: string;
  recommended?: boolean;
  icon: string;
  color: string;
  /** Signals THEMACHINE monitors from this system */
  signals: string[];
  /** Actions available through this connection */
  actions: string[];
  /** Whether enabled by default */
  defaultEnabled: boolean;
}

export interface IntegrationRuntime {
  enabled: boolean;
  status: ConnectionStatus;
  lastSync?: string;
}

export interface IntegrationCategory {
  id: IntegrationCategoryId | "all";
  label: string;
}
