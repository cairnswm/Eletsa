import React from 'react';

export const ActivityLoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
        <span className="text-gray-600">Loading latest activities...</span>
      </div>
    </div>
  );
};
