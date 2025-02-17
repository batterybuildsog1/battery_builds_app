import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';

interface AssumptionComparisonProps {
  originalAssumptions: string;
  modifiedAssumptions: string;
}

const AssumptionComparison: React.FC<AssumptionComparisonProps> = ({
  originalAssumptions,
  modifiedAssumptions,
}) => {
  const diffViewerStyles = {
    variables: {
      light: {
        diffViewerBackground: '#ffffff',
        addedBackground: '#e6ffec',
        addedColor: '#1a7f37',
        removedBackground: '#ffebe9',
        removedColor: '#cf222e',
        wordAddedBackground: '#abf2bc',
        wordRemovedBackground: '#ffc8c3',
        addedGutterBackground: '#ccffd8',
        removedGutterBackground: '#ffd7d5',
        gutterBackground: '#f6f8fa',
        gutterBackgroundDark: '#f0f1f3',
        highlightBackground: '#fffbdd',
        highlightGutterBackground: '#fff5b1',
        codeFoldGutterBackground: '#dbedff',
        codeFoldBackground: '#f1f8ff',
        emptyLineBackground: '#fafbfc',
        gutterColor: '#57606a',
        addedGutterColor: '#1a7f37',
        removedGutterColor: '#cf222e',
        codeFoldContentColor: '#57606a',
        diffViewerTitleBackground: '#f6f8fa',
        diffViewerTitleColor: '#24292f',
        diffViewerTitleBorderColor: '#d0d7de'
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Original</h2>
          <h2 className="text-lg font-semibold text-gray-700">Modified</h2>
        </div>
        <div className="p-4">
          <ReactDiffViewer
            oldValue={originalAssumptions}
            newValue={modifiedAssumptions}
            splitView={true}
            useDarkTheme={false}
            showDiffOnly={false}
            styles={diffViewerStyles}
            leftTitle="Original Assumptions"
            rightTitle="Modified Assumptions"
            extraLinesSurroundingDiff={3}
            className="text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default AssumptionComparison;
