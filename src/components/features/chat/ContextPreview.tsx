import React from 'react';
import styled from 'styled-components';

interface Assumption {
  key: string;
  value: string;
}

interface ContextPreviewProps {
  assumptions: Record<string, string>;
  version: string;
}

const PreviewContainer = styled.div`
  background-color: #f8f9fa;
  border-left: 3px solid #6c757d;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 4px 0;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

const VersionTag = styled.span`
  background-color: #e2e3e5;
  color: #495057;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8rem;
  margin-right: 8px;
`;

const AssumptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const AssumptionItem = styled.span`
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.8rem;
  color: #495057;
`;

const generateAssumptionSummary = (assumptions: Record<string, string>): Assumption[] => {
  return Object.entries(assumptions)
    .slice(0, 3)
    .map(([key, value]) => ({
      key,
      value: value.length > 30 ? `${value.substring(0, 27)}...` : value
    }));
};

const ContextPreview: React.FC<ContextPreviewProps> = ({ assumptions, version }) => {
  const assumptionSummary = generateAssumptionSummary(assumptions);
  const totalAssumptions = Object.keys(assumptions).length;

  return (
    <PreviewContainer role="region" aria-label="Context assumptions">
      <div>
        <VersionTag>Version: {version}</VersionTag>
        <span>{totalAssumptions} assumptions</span>
      </div>
      <AssumptionsList>
        {assumptionSummary.map(({ key, value }) => (
          <AssumptionItem key={key} title={`${key}: ${assumptions[key]}`}>
            {key}: {value}
          </AssumptionItem>
        ))}
        {totalAssumptions > 3 && (
          <AssumptionItem>+{totalAssumptions - 3} more</AssumptionItem>
        )}
      </AssumptionsList>
    </PreviewContainer>
  );
};

export default ContextPreview;