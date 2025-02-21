/**
 * Common API response types shared between frontend and backend
 */

/**
 * Base API response interface that all specific responses extend
 */
export interface ApiResponse {
  error: boolean;
  code: number;
  details?: string;
}

/**
 * Response type for Manual J related API endpoints
 */
export interface ManualJResponse extends ApiResponse {
  projectId: string;
  versionNumber: number;
}

/**
 * Type guard to check if a response is a ManualJ response
 */
export function isManualJResponse(response: unknown): response is ManualJResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'projectId' in response &&
    'versionNumber' in response &&
    'error' in response &&
    'code' in response
  );
}