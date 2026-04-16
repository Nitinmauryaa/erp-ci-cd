export interface BackendPaginationMeta {
  total: number;
  skip: number;
  limit: number;
  page: number;
  total_pages: number;
}

export interface BackendPaginatedResponse<T> {
  data: T[];
  meta: BackendPaginationMeta;
}

export function isBackendPaginatedResponse<T>(
  value: unknown
): value is BackendPaginatedResponse<T> {
  if (!value || typeof value !== "object") return false;
  const data = (value as { data?: unknown }).data;
  const meta = (value as { meta?: unknown }).meta;
  return Array.isArray(data) && !!meta && typeof meta === "object";
}

export function unwrapBackendList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (isBackendPaginatedResponse<T>(value)) return value.data;
  return [];
}
