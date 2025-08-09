import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useActivity } from '../contexts/useActivity';
import { DateFormat } from '../components/common/DateFormat';
import { ActivityCard } from '../components/latest/ActivityCard';
import { ActivityContent } from '../components/latest/ActivityContent';

export const Latest: React.FC = () => {
  const { activities, loading, error } = useActivity();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
          <span className="text-gray-600">Loading latest activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
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

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">Error loading activities</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Activities Feed */}
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity}>
                <ActivityContent activity={activity} />
              </ActivityCard>
            ))}
          </div>
                <DateFormat 
                  date={activity.created_at} 
                  className="text-xs text-gray-500"
                />
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-600 mb-6">
              Start engaging with events and other users to see activities here
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
