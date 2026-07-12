/** Standard API response envelope — ready for real backend swap */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
