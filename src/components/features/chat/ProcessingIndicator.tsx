import React from 'react';
import styled from 'styled-components';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
}

const ProcessingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  opacity: ${props => props.isProcessing ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  pointer-events: ${props => props.isProcessing ? 'auto' : 'none'};
`;

const ProcessingText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ 
  isProcessing 
}) => {
  if (!isProcessing) return null;

  return (
    <ProcessingWrapper
      isProcessing={isProcessing}
      role="status"
      aria-live="polite"
    >
      <LoadingIndicator size="small" />
      <ProcessingText>Processing message...</ProcessingText>
    </ProcessingWrapper>
  );
};

export default ProcessingIndicator;