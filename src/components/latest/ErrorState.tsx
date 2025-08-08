import React from 'react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8">
      <p className="font-medium">Error loading activities</p>
      <p className="text-sm">{error}</p>
    </div>
  );
};
