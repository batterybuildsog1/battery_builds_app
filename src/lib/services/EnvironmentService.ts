import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { FileUploadConfig } from '../../types/config';

// Define valid environment modes
const VALID_NODE_ENVS = ['development', 'test', 'production'] as const;

// Constants with const assertions for better type inference
const FILE_SIZES = {
  MIN: 1024 * 1024, // 1MB
  MAX: 100 * 1024 * 1024, // 100MB
  DEFAULT: 26214400, // 25MB
} as const;

// Custom error class for environment configuration issues
class EnvironmentError extends Error {
  constructor(message: string, public details?: Record<string, unknown>) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

// Zod schema for environment validation
const environmentSchema = z.object({
  NODE_ENV: z.enum(VALID_NODE_ENVS).default('development'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  MAX_FILE_SIZE: z.number()
    .int()
    .min(FILE_SIZES.MIN, `File size must be at least ${FILE_SIZES.MIN} bytes`)
    .max(FILE_SIZES.MAX, `File size must not exceed ${FILE_SIZES.MAX} bytes`)
    .default(FILE_SIZES.DEFAULT),
  GEMINI_API_ENDPOINT: z.string().url('GEMINI_API_ENDPOINT must be a valid URL'),
  GEMINI_REASONING_MODEL: z.string().min(1, 'GEMINI_REASONING_MODEL is required'),
  GEMINI_VISION_MODEL: z.string().min(1, 'GEMINI_VISION_MODEL is required'),
});

// Infer the type from the schema
type EnvironmentConfig = z.infer<typeof environmentSchema>;

/**
 * Service for managing environment configuration
 * Implements singleton pattern and provides validated environment variables
 */
export class EnvironmentService {
  private static instance: EnvironmentService;
  private readonly config: EnvironmentConfig;

  private constructor() {
    this.loadEnvironmentFiles();
    this.config = this.validateAndLoadConfig();
    this.freezeConfig();
  }

  /**
   * Gets the singleton instance of EnvironmentService
   * @returns {EnvironmentService} The singleton instance
   */
  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  /**
   * Returns the validated and frozen environment configuration
   * @returns {Readonly<EnvironmentConfig>} The environment configuration
   */
  public getConfig(): Readonly<EnvironmentConfig> {
    return this.config;
  }

  public getMaxFileSize(): number {
    return this.config.MAX_FILE_SIZE;
  }

  public getFileUploadConfig(): Readonly<FileUploadConfig> {
    const maxSizeMB = Math.floor(this.config.MAX_FILE_SIZE / (1024 * 1024));
    return {
      maxSizeBytes: this.config.MAX_FILE_SIZE,
      allowedTypes: ['application/pdf'] as const,
      errorMessages: {
        sizeLimitExceeded: `File size must be less than ${maxSizeMB} MB`,
        invalidType: 'Only PDF files are allowed',
        uploadFailed: 'Failed to upload file. Please try again.'
      }
    };
  }

  /**
   * Loads environment variables from .env and .env.local files
   * Note: .env.development is not used - all local overrides should go in .env.local
   * Loading order:
   * 1. Base .env file (shared defaults)
   * 2. .env.local file (local overrides, not committed to version control)
   */
  private loadEnvironmentFiles(): void {
    try {
      // Load base .env file first (shared defaults)
      const baseEnvPath = path.resolve(process.cwd(), '.env');
      const baseResult = dotenv.config({ path: baseEnvPath });
      
      if (baseResult.error) {
        console.debug('No base .env file found at root');
      }

      // Load .env.local for local overrides (takes precedence over base .env)
      const localEnvPath = path.resolve(process.cwd(), '.env.local');
      const localResult = dotenv.config({ path: localEnvPath, override: true });
      
      if (localResult.error) {
        console.debug('No .env.local file found');
      }
    } catch (error) {
      throw new EnvironmentError('Failed to load environment files', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private freezeConfig(): void {
    Object.freeze(this.config);
    Object.keys(this.config).forEach(key => {
      if (typeof this.config[key as keyof EnvironmentConfig] === 'object') {
        Object.freeze(this.config[key as keyof EnvironmentConfig]);
      }
    });
  }

  /**
   * For testing purposes only - allows resetting the singleton instance
   * @throws {Error} If not in test environment
   */
  public static resetInstance(): void {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('resetInstance can only be called in test environment');
    }
    EnvironmentService.instance = undefined as any;
  }

  /**
   * Validates and loads the environment configuration
   * Ensures all required variables are present and correctly typed
   * Variables from .env.local take precedence over base .env
   */
  private validateAndLoadConfig(): EnvironmentConfig {
    try {
      // Parse MAX_FILE_SIZE from environment if present (after .env.local override)
      const rawMaxFileSize = process.env.MAX_FILE_SIZE 
        ? parseInt(process.env.MAX_FILE_SIZE, 10)
        : FILE_SIZES.DEFAULT;

      const envData = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        MAX_FILE_SIZE: rawMaxFileSize,
        GEMINI_API_ENDPOINT: process.env.GEMINI_API_ENDPOINT,
        GEMINI_REASONING_MODEL: process.env.GEMINI_REASONING_MODEL,
        GEMINI_VISION_MODEL: process.env.GEMINI_VISION_MODEL,
      };

      const result = environmentSchema.safeParse(envData);

      if (!result.success) {
        const formattedError = result.error.format();
        throw new EnvironmentError('Environment validation failed', formattedError);
      }

      return result.data;
    } catch (error) {
      if (error instanceof EnvironmentError) {
        throw error;
      }
      throw new EnvironmentError(
        'Failed to load environment configuration',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }
}

// Export singleton instance
export const environmentService = EnvironmentService.getInstance();

// Export types for use in other parts of the application
export type { EnvironmentConfig };
