import type { ApiResponse, ModuleMeta, ModuleId } from "@/types";
import { getModuleMeta } from "@/mock/data/modules";
import { apiRequest, notFound } from "./client";

function wrap<T>(data: T): ApiResponse<T> {
  return { data, meta: { timestamp: new Date().toISOString() } };
}

export const modulesApi = {
  getMeta(id: ModuleId): Promise<ApiResponse<ModuleMeta>> {
    return apiRequest(() => {
      const meta = getModuleMeta(id);
      if (!meta) notFound("ماژول", id);
      return wrap(meta);
    });
  },
};
