import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import ManualJForm from '../components/organisms/ManualJForm';
import AssumptionsEditor from '../components/organisms/AssumptionsEditor';
import ResultsDisplay from '../components/organisms/ResultsDisplay';
import ChatContainer from '../components/features/chat/ChatContainer';

const meta: Meta = {
  title: 'Integration/Manual J Workflow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An integrated view of the Manual J calculation workflow, showcasing the interaction between form submission, results display, assumptions editing, and chat functionality.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="p-8 max-w-4xl mx-auto">
        <Story />
      </div>
    )
  ]
};

export default meta;

const mockChartData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const mockCsvData = 'parameter,value\nWindow U-Value,0.35\nWall R-Value,13\nRoof R-Value,30';
const mockAssumptions = {
  'Window U-Value': '0.35',
  'Wall R-Value': '13',
  'Roof R-Value': '30',
  'Infiltration Rate': '0.35',
  'Ventilation Rate': '0.30'
};

const ManualJIntegration = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<string>('');
  const [csvData, setCsvData] = useState<string>('');
  const [assumptions, setAssumptions] = useState<Record<string, string>>({});
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  const handleFormSuccess = async (newProjectId: string) => {
    setProjectId(newProjectId);
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setChartData(mockChartData);
    setCsvData(mockCsvData);
    setAssumptions(mockAssumptions);
  };

  const handleAssumptionsSave = async (updatedAssumptions: Record<string, string>) => {
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAssumptions(updatedAssumptions);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Manual J Calculator</h1>
      
      {!projectId ? (
        <ManualJForm 
          onSubmitSuccess={handleFormSuccess}
          className="mt-6"
        />
      ) : (
        <div className="space-y-8">
          <ResultsDisplay
            chartData={chartData}
            csvData={csvData}
          />
          
          <AssumptionsEditor
            assumptions={assumptions}
            onSave={handleAssumptionsSave}
            className="mt-8"
          />
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Chat with Our Assistant</h2>
            <ChatContainer
              projectId={projectId}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              className="mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

type Story = StoryObj<typeof ManualJIntegration>;

export const Default: Story = {
  render: () => <ManualJIntegration />,
  parameters: {
    docs: {
      story: {
        inline: true
      },
      description: {
        story: `
This story demonstrates the complete Manual J workflow:
1. Initial form submission with PDF upload and location input
2. Results display with chart and CSV download
3. Assumptions editor for modifying calculation parameters
4. Chat interface for asking questions about the results

The story uses mock data to simulate API responses and demonstrate the various states and interactions between components.
        `
      }
    }
  }
};