import React, { useEffect, useMemo } from 'react';
import { FileUploader } from '../design-system/molecules/FileUploader';
import { ManualJResponse, isManualJResponse } from '../../types/api';
import { FileUploadConfig } from '../../types/config';
import Input from '../design-system/atoms/Input';
import Button from '../design-system/atoms/Button';
import { useManualJStore } from '../../lib/stores/manualJStore';
import { environmentService } from '../../lib/services/EnvironmentService';

type FileUploadErrorType = 'file-too-large' | 'invalid-file-type' | string;

interface ManualJFormProps {
  onSubmitSuccess?: (projectId: string) => void;
  className?: string;
}

const ManualJForm: React.FC<ManualJFormProps> = ({
  onSubmitSuccess,
  className = '',
}) => {
  const {
    pdfFile,
    location,
    isLoading,
    error,
    setPdfFile,
    setLocation,
    setError,
    setLoading
  } = useManualJStore();

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setError('');
  };

  const handleFileError = (errorMessage: FileUploadErrorType) => {
    setError(fileUploadConfig.errorMessages[errorMessage] || errorMessage);
  };

  useEffect(() => {
    // Cleanup effect when component unmounts
    return () => {
      setLoading(false);
      setError('');
    };
  }, []);

  const resetForm = () => {
    setPdfFile(null);
    setLocation('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pdfFile) {
      setError('Please upload a PDF file.');
      return;
    }

    if (location && location.length > 100) {
      setError('Location must be less than 100 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      if (location) {
        formData.append('location', location);
      }
      
      const response = await fetch('/api/manual-j/init', {
        method: 'POST',
        body: formData,
      });

      // Check if response is ok and verify content type
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Server error occurred');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Verify JSON content type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      
      if (!isManualJResponse(data)) {
        throw new Error('Invalid response format from server');
      }
      
      if (data.error) {
        throw new Error(data.details || 'Server error occurred');
      }

      // Reset form on success
      resetForm();
      onSubmitSuccess?.(data.projectId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request.';
      setError(errorMessage);
      console.error('Manual J form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fileUploadConfig = useMemo(() => environmentService.getFileUploadConfig(), []);
  const maxSizeMB = useMemo(() => Math.floor(fileUploadConfig.maxSizeBytes / (1024 * 1024)), [fileUploadConfig]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 ${className}`}
      data-testid="manual-j-form"
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-2">
          Maximum file size: {maxSizeMB}MB
        </div>
        <FileUploader
          accept={fileUploadConfig.allowedTypes[0]}
          maxSize={fileUploadConfig.maxSizeBytes}
          aria-label="PDF file upload"
          onFileSelect={handleFileSelect}
          onError={handleFileError}
          className="w-full"
        />

        <Input
          id="location"
          name="location"
          type="text"
          label="Location (Zip or Address)"
          placeholder="Optional – if not given, you will be prompted"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          error={error}
          aria-label="Location input"
        />
      </div>

      <div role="status" aria-live="polite" className="mt-2">
        {isLoading && (
          <p className="text-sm text-gray-600">Processing your Manual J analysis...</p>
        )}
      </div>
      
      {error && (
        <div role="alert" className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading || !pdfFile}
        fullWidth
        aria-busy={isLoading}
      >
        {isLoading ? 'Running Analysis...' : 'Run Manual J'}
      </Button>
    </form>
  );
};

export default ManualJForm;
