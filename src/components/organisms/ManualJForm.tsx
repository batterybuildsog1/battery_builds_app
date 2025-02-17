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

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      onSubmitSuccess?.(data.projectId);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request.');
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
          label="Location (Zip or Address)"
          placeholder="Optional – if not given, you will be prompted"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          error={error}
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