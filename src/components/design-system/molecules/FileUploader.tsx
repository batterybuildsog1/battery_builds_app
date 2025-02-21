"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FileUploadConfig } from '../../../types/config';
import { environmentService } from '../../../lib/services/EnvironmentService';

type FileValidationError = 
  | 'INVALID_TYPE'
  | 'SIZE_LIMIT_EXCEEDED'
  | 'UPLOAD_FAILED'
  | 'PDF_VERSION_UNSUPPORTED';

interface FileUploaderProps {
  config?: FileUploadConfig;
  onFileSelect: (file: File) => void;
  onError?: (error: string, type?: FileValidationError) => void;
  className?: string;
  onProgress?: (progress: number) => void;
  maxRetries?: number;
}

interface FileValidationResult {
  isValid: boolean;
  error?: FileValidationError;
  message?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  config = environmentService.getFileUploadConfig(),
  onFileSelect,
  onError,
  className = "",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
      setSelectedFile(null);
      setUploadProgress(0);
      setError("");
    };
  }, []);

  const validateFile = useCallback(async (file: File): Promise<FileValidationResult> => {
    if (!config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'INVALID_TYPE',
        message: config.errorMessages.invalidType
      };
    }

    if (file.size > config.maxSizeBytes) {
      return {
        isValid: false,
        error: 'SIZE_LIMIT_EXCEEDED',
        message: config.errorMessages.sizeLimitExceeded
      };
    }

    // Check PDF version if it's a PDF file
    if (file.type === 'application/pdf') {
      try {
        const buffer = await file.arrayBuffer();
        const view = new Uint8Array(buffer);
        const header = new TextDecoder().decode(view.slice(0, 8));
        if (!header.match(/%PDF-1\.[3-7]/)) {
          return {
            isValid: false,
            error: 'PDF_VERSION_UNSUPPORTED',
            message: 'Unsupported PDF version. Please use PDF version 1.3 or higher.'
          };
        }
      } catch (e) {
        return {
          isValid: false,
          error: 'INVALID_TYPE',
          message: 'Unable to validate PDF format'
        };
      }
    }

    return { isValid: true };
  }, [config]);

  const handleFile = async (file: File) => {
    setError("");
    const validationResult = await validateFile(file);
    
    if (validationResult.isValid) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        
        const updateProgress = (progress: number) => {
          if (!isUploading) return; // Prevent updates if component is unmounting
          setUploadProgress(progress);
          onProgress?.(progress);
        };

        setSelectedFile(file);
        
        // Create cleanup function for the FileReader
        const reader = new FileReader();
        const cleanupReader = () => {
          reader.abort();
          reader.onloadend = null;
        };

        try {
          await onFileSelect(file);
          updateProgress(100);
        } finally {
          cleanupReader();
        }
      } catch (err) {
        if (retryCount < (maxRetries || 3)) {
          setRetryCount(prev => prev + 1);
          handleFile(file);
        } else {
          setError("Upload failed after multiple attempts");
          onError?.("Upload failed after multiple attempts");
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: config.maxSizeBytes,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection) {
        const errorMessage = rejection.errors[0]?.message || 'File upload failed';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        role="button"
        tabIndex={0}
        aria-label={selectedFile ? "File upload area. File selected." : "Drop file here or click to upload"}
        aria-describedby={error ? "upload-error" : undefined}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${selectedFile ? 'bg-gray-50' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          {!selectedFile ? (
            <>
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag building plans here or click to upload
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF files only, up to {Math.floor(config.maxSizeBytes / (1024 * 1024))}MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
              <div className="flex items-center flex-1">
                <DocumentIcon className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {selectedFile.name}
                </span>
                {isUploading && (
                  <div className="ml-2 flex items-center">
                    <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="ml-2 text-sm text-blue-500">{uploadProgress}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {uploadProgress < 100 && (
                  <div className="w-24 h-1 bg-gray-200 rounded-full mr-3">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Remove file"
                  disabled={isUploading}
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p 
          id="upload-error"
          className="mt-2 text-sm text-red-600" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      <div className="sr-only" aria-live="polite">
        {isUploading && `Upload progress: ${uploadProgress}%`}
      </div>
    </div>
  );
};

export default FileUploader;
