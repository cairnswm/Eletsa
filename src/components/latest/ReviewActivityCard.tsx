import React from 'react';
import { Star } from 'lucide-react';
import { ActivityItem } from '../../types/activity';

interface ReviewActivityCardProps {
  activity: ActivityItem;
  children: React.ReactNode;
}

export const ReviewActivityCard: React.FC<ReviewActivityCardProps> = ({ activity, children }) => {
  return (
    <div className="bg-gradient-to-r from-[#f0900a]/10 to-[#FF2D95]/10 border-[#f0900a]/20 rounded-xl border p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Star className="w-5 h-5 text-[#f0900a]" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium leading-relaxed">
            {children}
          </div>
          {activity.review_snippet && (
            <div className="mt-3 bg-white/60 rounded-lg p-3 border border-white/40">
              <div className="flex items-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (activity.review_rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm italic">"{activity.review_snippet}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
