"use client";
import React, { useState } from "react";
import ManualJForm from "../../components/organisms/ManualJForm";
import AssumptionsEditor from "../../components/organisms/AssumptionsEditor";
import ResultsDisplay from "../../components/organisms/ResultsDisplay";
import ChatContainer from "../../components/features/chat/ChatContainer";
import { useManualJStore } from "../../lib/stores/manualJStore";

export default function ManualJPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<string>("");
  const [csvData, setCsvData] = useState<string>("");
  const [assumptions, setAssumptions] = useState<Record<string, string>>({});
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  const handleFormSuccess = async (newProjectId: string) => {
    setProjectId(newProjectId);
    try {
      const response = await fetch(`/api/manual-j/${newProjectId}/results`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setChartData(data.chartData);
      setCsvData(data.csvData);
      setAssumptions(JSON.parse(data.dynamicAssumptions));
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  };

  const handleAssumptionsSave = async (updatedAssumptions: Record<string, string>) => {
    if (!projectId) return;

    const response = await fetch(`/api/manual-j/${projectId}/assumptions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assumptions: updatedAssumptions }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    setChartData(data.chartData);
    setCsvData(data.csvData);
    setAssumptions(updatedAssumptions);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
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
}
