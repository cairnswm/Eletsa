import React from 'react';
import { TrendingUp } from 'lucide-react';

export const EmptyActivitiesState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <TrendingUp className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
      <p className="text-gray-600 mb-6">
        Start engaging with events and other users to see activities here
      </p>
    </div>
  );
};
