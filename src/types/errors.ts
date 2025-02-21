/**
 * Standardized error codes for the application.
 * Used for consistent error handling across components and API routes.
 */
export enum ErrorCode {
  // File operation errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_CORRUPTED = 'FILE_CORRUPTED',

  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // General operation errors
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Form submission errors
  FORM_VALIDATION_ERROR = 'FORM_VALIDATION_ERROR',
  FORM_SUBMISSION_FAILED = 'FORM_SUBMISSION_FAILED',

  // API related errors
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // LLM related errors
  LLM_RESPONSE_ERROR = 'LLM_RESPONSE_ERROR',
  LLM_INVALID_PROMPT = 'LLM_INVALID_PROMPT',
  LLM_CONTEXT_TOO_LONG = 'LLM_CONTEXT_TOO_LONG',
  LLM_TOKEN_LIMIT_EXCEEDED = 'LLM_TOKEN_LIMIT_EXCEEDED',
  LLM_CONTENT_FILTERED = 'LLM_CONTENT_FILTERED',
  LLM_MODEL_UNAVAILABLE = 'LLM_MODEL_UNAVAILABLE',
  LLM_RATE_LIMIT_EXCEEDED = 'LLM_RATE_LIMIT_EXCEEDED'
}

/**
 * Interface defining the structure of error limits and thresholds.
 * These values should match the environment configuration.
 */
interface ErrorLimits {
  maxFileSize: number;
  maxTokenLength: number;
  maxContextLength: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

/**
 * Dynamic error limits pulled from environment variables.
 * @important Update these values when modifying environment configuration
 */
export const ERROR_LIMITS: ErrorLimits = {
  maxFileSize: Number(process.env.MAX_FILE_SIZE_MB) || 10, // MB
  maxTokenLength: Number(process.env.MAX_TOKEN_LENGTH) || 4096,
  maxContextLength: Number(process.env.MAX_CONTEXT_LENGTH) || 8192,
  rateLimit: {
    requestsPerMinute: Number(process.env.RATE_LIMIT_PER_MINUTE) || 10,
    requestsPerHour: Number(process.env.RATE_LIMIT_PER_HOUR) || 100
  }
};

/**
 * Helper function to generate error messages with current limits
 */
export function getErrorMessage(code: ErrorCode): string {
  switch (code) {
    case ErrorCode.FILE_TOO_LARGE:
      return `File size exceeds maximum allowed size of ${ERROR_LIMITS.maxFileSize}MB`;
    case ErrorCode.LLM_TOKEN_LIMIT_EXCEEDED:
      return `Input exceeds maximum token limit of ${ERROR_LIMITS.maxTokenLength} tokens`;
    case ErrorCode.LLM_CONTEXT_TOO_LONG:
      return `Context length exceeds maximum of ${ERROR_LIMITS.maxContextLength} tokens`;
    case ErrorCode.LLM_RATE_LIMIT_EXCEEDED:
      return `Rate limit exceeded. Maximum ${ERROR_LIMITS.rateLimit.requestsPerMinute} requests per minute or ${ERROR_LIMITS.rateLimit.requestsPerHour} requests per hour`;
    default:
      return code;
  }
}
