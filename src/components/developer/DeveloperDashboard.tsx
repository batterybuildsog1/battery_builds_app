import React, { useState, useEffect } from 'react';
import { LogEntry, loggingService } from '@/lib/services/LoggingService';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const LogEntryDisplay: React.FC<{ log: LogEntry }> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColor = log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const formattedTime = new Date(log.timestamp).toLocaleString();

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {log.status}
          </span>
          <span className="text-gray-600">{formattedTime}</span>
          <span className="font-medium">{log.requestType}</span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Prompt:</h4>
            <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">
              {log.prompt}
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Response:</h4>
            <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">
              {log.response}
            </pre>
          </div>
          {log.errorMessage && (
            <div>
              <h4 className="text-sm font-medium text-red-700">Error:</h4>
              <pre className="mt-1 text-sm text-red-600 whitespace-pre-wrap bg-red-50 p-2 rounded">
                {log.errorMessage}
              </pre>
            </div>
          )}
          <div className="text-sm text-gray-600">
            Processing Time: {log.processingTime}ms
          </div>
        </div>
      )}
    </div>
  );
};

export const DeveloperDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = () => {
      const currentLogs = loggingService.getLogs();
      setLogs(currentLogs);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gray-50 border rounded-lg shadow-lg w-[800px] max-h-[80vh] flex flex-col">
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Developer Dashboard</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close dashboard"
            >
              <ChevronDownIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center">No logs available</p>
            ) : (
              logs.map((log) => (
                <LogEntryDisplay key={log.id} log={log} />
              ))
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          aria-label="Open developer dashboard"
        >
          <span>Dev Dashboard</span>
          <ChevronUpIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};