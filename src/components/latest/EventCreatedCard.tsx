import React from 'react';
import { Calendar } from 'lucide-react';
import { ActivityItem } from '../../types/activity';

interface EventCreatedCardProps {
  activity: ActivityItem;
  children: React.ReactNode;
}

export const EventCreatedCard: React.FC<EventCreatedCardProps> = ({ activity, children }) => {
  return (
    <div className="bg-gradient-to-r from-[#1E30FF]/10 to-[#FF2D95]/10 border-[#1E30FF]/20 rounded-xl border p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5 text-[#1E30FF]" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium leading-relaxed">
            {children}
          </div>
          {activity.event_date && (
            <div className="mt-2 text-sm text-gray-600">
              Event Date: {new Date(activity.event_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
