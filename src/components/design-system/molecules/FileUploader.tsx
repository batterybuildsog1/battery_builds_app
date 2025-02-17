"use client";
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = "application/pdf",
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFileSelect,
  onError,
  className = "",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const validateFile = useCallback((file: File): boolean => {
    if (!file.type.match(accept)) {
      const errorMessage = "Please upload a valid PDF file.";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    if (file.size > maxSize) {
      const errorMessage = `File size should be less than ${maxSize / (1024 * 1024)}MB.`;
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    setError("");
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize,
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
                PDF files only, up to {maxSize / (1024 * 1024)}MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
              <div className="flex items-center">
                <DocumentIcon className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Remove file"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
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
