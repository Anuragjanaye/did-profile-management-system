/**
 * Global shared API response types.
 * Every Route Handler must return one of these shapes.
 */

/** Successful API response */
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

/** Failed API response */
export interface ApiError {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, string[]>;
  };
}

/** Union type for all API responses */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

/** Standardized error codes across all endpoints */
export enum ApiErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT = "RATE_LIMIT",
  BLOCKCHAIN_ERROR = "BLOCKCHAIN_ERROR",
  AI_ERROR = "AI_ERROR",
  UPLOAD_ERROR = "UPLOAD_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

/** Pagination metadata returned alongside list responses */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Paginated response shape */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
