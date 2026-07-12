import { API_CONFIG } from "@/config";
import type { ApiErrorBody } from "@/types";

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulated async request — swap implementation when backend is ready */
export async function apiRequest<T>(
  handler: () => T,
  options?: { delayMs?: number }
): Promise<T> {
  await delay(options?.delayMs ?? API_CONFIG.mockDelayMs);
  return handler();
}

/** Sync access for SSG / generateStaticParams */
export function apiRequestSync<T>(handler: () => T): T {
  return handler();
}

export function notFound(resource: string, id?: string): never {
  throw new ApiError(404, {
    code: "NOT_FOUND",
    message: id ? `${resource} با شناسه ${id} یافت نشد` : `${resource} یافت نشد`,
  });
}
