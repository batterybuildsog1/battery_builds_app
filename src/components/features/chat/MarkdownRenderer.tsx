import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const customComponents = {
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto w-full">
        <table {...props} className="min-w-full table-auto border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead {...props} className="bg-gray-50">
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th {...props} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td {...props} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {children}
      </td>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <div className="rounded-md bg-gray-50 p-4 overflow-x-auto">
          <code
            className={`${className} block text-sm font-mono`}
            {...props}
          >
            {children}
          </code>
        </div>
      ) : (
        <code
          className={`${className} px-1 py-0.5 rounded-md bg-gray-100 font-mono text-sm`}
          {...props}
        >
          {children}
        </code>
      );
    }
  };

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown components={customComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;