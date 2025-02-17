"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { DeveloperDashboard } from "../../components/developer/DeveloperDashboard";
import ManualJForm from "../../components/organisms/ManualJForm";
import AssumptionsEditor from "../../components/organisms/AssumptionsEditor";
import ResultsDisplay from "../../components/organisms/ResultsDisplay";
import ChatContainer from "../../components/features/chat/ChatContainer";
import AuthStatus from "../../components/auth/AuthStatus";
import ToolGuide from "../../components/info/ToolGuide";
import ProgressTracker from "../../components/progress/ProgressTracker";
import { useManualJStore } from "../../lib/stores/manualJStore";

export default function ManualJPage() {
  const { data: session, status } = useSession();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<string>("");
  const [csvData, setCsvData] = useState<string>("");
  const [assumptions, setAssumptions] = useState<Record<string, string>>({});
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const progressSteps = [
    {
      id: "upload",
      label: "PDF Upload",
      description: "Upload and validate your floor plan PDF",
      status: "pending" as const
    },
    {
      id: "analysis",
      label: "Plan Analysis",
      description: "Extracting dimensions and features",
      status: "pending" as const
    },
    {
      id: "calculation",
      label: "Load Calculations",
      description: "Computing heating and cooling requirements",
      status: "pending" as const
    },
    {
      id: "report",
      label: "Report Generation",
      description: "Creating final documentation",
      status: "pending" as const
    }
  ];

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
    <div className="min-h-screen bg-gray-50 relative">
      {process.env.NODE_ENV === 'development' && <DeveloperDashboard />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Manual J Calculator</h1>
            
            {status === "loading" ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : !session ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Please use the sign in button in the header to access the Manual J Calculator</p>
              </div>
            ) : !projectId ? (
              <div className="space-y-8">
                <ToolGuide />
                <div className="border-t border-gray-200 pt-8">
                  <ManualJForm 
                    onSubmitSuccess={handleFormSuccess}
                    className="mb-8"
                  />
                  <ProgressTracker 
                    steps={progressSteps}
                    currentStepIndex={currentStep}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <ResultsDisplay
                  chartData={chartData}
                  csvData={csvData}
                />
                
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Adjust Assumptions</h2>
                  <AssumptionsEditor
                    assumptions={assumptions}
                    onSave={handleAssumptionsSave}
                    className="mt-4"
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat with Our Assistant</h2>
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
        </div>
      </div>
    </div>
  );
}
