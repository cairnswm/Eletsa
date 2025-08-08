import React from 'react';
import { Users } from 'lucide-react';
import { ActivityItem } from '../../types/activity';

interface FollowActivityCardProps {
  activity: ActivityItem;
  children: React.ReactNode;
}

export const FollowActivityCard: React.FC<FollowActivityCardProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-r from-[#489707]/10 to-[#1E30FF]/10 border-[#489707]/20 rounded-xl border p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-[#489707]" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
