import React from 'react';
import { LoadingIndicator } from '@/components/design-system/molecules/LoadingIndicator';
import styles from './ProcessingIndicator.module.css';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ 
  isProcessing 
}) => {
  if (!isProcessing) return null;

  return (
    <div
      className={styles.processingWrapper}
      data-processing={isProcessing}
      role="status"
      aria-live="polite"
    >
      <LoadingIndicator size="small" />
      <span className={styles.processingText}>
        Processing message...
      </span>
    </div>
  );
};

export default ProcessingIndicator;
