import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

export interface ProgressStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStepIndex?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStepIndex = 0 }) => {
  const getStepIcon = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        );
      default:
        return <ClockIcon className="w-6 h-6 text-gray-300" />;
    }
  };

  const getStepClassName = (status: ProgressStep['status'], index: number) => {
    const baseClasses = "flex items-start space-x-4 p-4 rounded-lg";
    const statusClasses = {
      completed: "bg-green-50",
      error: "bg-red-50",
      processing: "bg-blue-50",
      pending: "bg-gray-50"
    };
    return `${baseClasses} ${statusClasses[status]}`;
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Overall Progress Bar */}
      <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={getStepClassName(step.status, index)}
            role="listitem"
            aria-current={index === currentStepIndex ? 'step' : undefined}
          >
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${
                step.status === 'error' ? 'text-red-800' :
                step.status === 'completed' ? 'text-green-800' :
                step.status === 'processing' ? 'text-blue-800' :
                'text-gray-800'
              }`}>
                {step.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {step.description}
              </p>
            </div>
            {/* Step Number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-gray-600">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;