import type { ApiResponse, User } from "@/types";
import {
  aiSummary,
  floatingMetrics,
  timelineEvents,
  aiSuggestions,
  integrations,
  commandPaletteItems,
  dockItems,
} from "@/mock/data/command-center";
import { currentUserMock } from "@/mock/data/user";
import { apiRequest } from "./client";

function wrap<T>(data: T): ApiResponse<T> {
  return { data, meta: { timestamp: new Date().toISOString() } };
}

export const commandCenterApi = {
  getSummary() {
    return apiRequest(() => wrap(aiSummary));
  },
  getMetrics() {
    return apiRequest(() => wrap(floatingMetrics));
  },
  getTimeline() {
    return apiRequest(() => wrap(timelineEvents));
  },
  getSuggestions() {
    return apiRequest(() => wrap(aiSuggestions));
  },
  getIntegrations() {
    return apiRequest(() => wrap(integrations));
  },
  getSearchItems() {
    return apiRequest(() => wrap(commandPaletteItems));
  },
  getDockItems() {
    return apiRequest(() => wrap(dockItems));
  },
};

export const userApi = {
  getCurrent(): Promise<ApiResponse<User>> {
    return apiRequest(() => wrap(currentUserMock));
  },
};

export { imagingApi } from "./imaging";
export { patientsApi } from "./patients";
export { doctorsApi } from "./doctors";
export { modulesApi } from "./modules";
export { ApiError, apiRequest, apiRequestSync } from "./client";
