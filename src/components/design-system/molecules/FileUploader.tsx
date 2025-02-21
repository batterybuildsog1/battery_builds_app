"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FileUploadConfig } from '../../../types/config';
import { environmentService } from '../../../lib/services/EnvironmentService';

interface FileUploaderProps {
  config?: FileUploadConfig;
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  className?: string;
  onProgress?: (progress: number) => void;
  maxRetries?: number;
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

  const validateFile = useCallback((file: File) => {
    if (!config.allowedTypes.includes(file.type)) {
      setError(config.errorMessages.invalidType);
      onError?.(config.errorMessages.invalidType);
      return false;
    }

    if (file.size > config.maxSizeBytes) {
      setError(config.errorMessages.sizeLimitExceeded);
      onError?.(config.errorMessages.sizeLimitExceeded);
      return false;
    }
    return true;
  }, [config, onError]);

  const handleFile = async (file: File) => {
    setError("");
    if (validateFile(file)) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simulate upload progress
        const updateProgress = (progress: number) => {
          setUploadProgress(progress);
          onProgress?.(progress);
        };

        // Set the file and notify parent
        setSelectedFile(file);
        await onFileSelect(file);
        
        setUploadProgress(100);
        setIsUploading(false);
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
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
