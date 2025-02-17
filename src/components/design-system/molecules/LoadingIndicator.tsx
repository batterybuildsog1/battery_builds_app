import React from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  label?: string;
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-12 h-12'
};

const colorClasses = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-gray-600 border-t-transparent',
  white: 'border-white border-t-transparent'
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'medium',
  color = 'primary',
  label
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-4
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <span className="mt-2 text-sm text-gray-600">
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingIndicator;