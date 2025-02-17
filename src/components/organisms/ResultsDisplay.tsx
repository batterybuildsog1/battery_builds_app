import React from 'react';

interface ResultsDisplayProps {
  chartData: string;
  csvData: string;
  manualJResultsCsv?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ chartData, csvData }) => {
  if (!chartData && !csvData) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-2">Results</h2>
      <div className="space-y-4">
        <div id="chart-container" className="w-full">
          {chartData ? (
            <img 
              src={chartData} 
              alt="Heat Loads Chart" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg text-gray-600">
              Chart unavailable
            </div>
          )}
        </div>
        
        <div className="mt-4 space-x-4">
          {csvData && (
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`}
              download="manual_j_assumptions.csv"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Download Assumptions CSV
            </a>
          )}
          {manualJResultsCsv && (
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(manualJResultsCsv)}`}
              download="manual_j_results.csv"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Download Manual J Results
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
