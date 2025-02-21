/**
 * Configuration interface for file upload settings
 */
export interface FileUploadConfig {
  /** Maximum allowed file size in bytes */
  maxSizeBytes: number;
  
  /** Array of allowed file mime types */
  allowedTypes: string[];
  
  /** Error messages for different upload scenarios */
  errorMessages: {
    /** Message shown when file size exceeds the limit */
    sizeLimitExceeded: string;
    
    /** Message shown when file type is not allowed */
    invalidType: string;
    
    /** Message shown when upload fails for other reasons */
    uploadFailed: string;
  };
}