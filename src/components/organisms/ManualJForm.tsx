import React from 'react';
import { FileUploader } from '../design-system/molecules/FileUploader';
import Input from '../design-system/atoms/Input';
import Button from '../design-system/atoms/Button';
import { useManualJStore } from '../../lib/stores/manualJStore';

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

  const handleFileError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pdfFile) {
      setError('Please upload a PDF file.');
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
      
      if (data.error) {
        throw new Error(data.error);
      }

      onSubmitSuccess?.(data.projectId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 ${className}`}
      data-testid="manual-j-form"
    >
      <div className="space-y-4">
        <FileUploader
          accept="application/pdf"
          maxSize={10 * 1024 * 1024}
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

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading || !pdfFile}
        fullWidth
      >
        {isLoading ? 'Running Analysis...' : 'Run Manual J'}
      </Button>
    </form>
  );
};

export default ManualJForm;
