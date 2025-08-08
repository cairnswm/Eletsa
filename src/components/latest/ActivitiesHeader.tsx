import React from 'react';
import { TrendingUp } from 'lucide-react';

export const ActivitiesHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
        <TrendingUp className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
        Latest Activities
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Stay up to date with what's happening in your community
      </p>
    </div>
  );
};
