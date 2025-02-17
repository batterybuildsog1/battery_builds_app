import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../design-system/atoms/Input';
import Button from '../design-system/atoms/Button';

interface Assumption {
  [key: string]: string;
}

interface AssumptionsEditorProps {
  assumptions: Assumption;
  onSave: (updatedAssumptions: Assumption) => Promise<void>;
  className?: string;
}

const EditorContainer = styled.div`
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: #F9FAFB;
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const AssumptionsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr);
  gap: 1rem;
  padding: 1rem;
`;

const AssumptionRow = styled.div`
  display: contents;
`;

const Footer = styled.div`
  padding: 1rem;
  background-color: #F9FAFB;
  border-top: 1px solid #E5E7EB;
  display: flex;
  justify-content: flex-end;
`;

const AssumptionsEditor: React.FC<AssumptionsEditorProps> = ({
  assumptions,
  onSave,
  className
}) => {
  const [editedAssumptions, setEditedAssumptions] = useState<Assumption>(assumptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setEditedAssumptions(prev => ({
      ...prev,
      [key]: value
    }));
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onSave(editedAssumptions);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditorContainer className={className}>
      <Header>
        <Title>Manual J Assumptions</Title>
      </Header>
      
      <AssumptionsGrid role="grid" aria-label="Assumptions Editor">
        {Object.entries(editedAssumptions).map(([key, value]) => (
          <AssumptionRow key={key} role="row">
            <Input
              label={key}
              id={`assumption-${key}`}
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              aria-label={`Edit ${key}`}
              fullWidth
            />
          </AssumptionRow>
        ))}
      </AssumptionsGrid>

      <Footer>
        {error && (
          <span className="text-red-600 mr-4" role="alert">
            {error}
          </span>
        )}
        <Button
          onClick={handleSave}
          isLoading={isLoading}
          disabled={isLoading}
          variant="primary"
        >
          Save Changes & Re-run Analysis
        </Button>
      </Footer>
    </EditorContainer>
  );
};

export default AssumptionsEditor;