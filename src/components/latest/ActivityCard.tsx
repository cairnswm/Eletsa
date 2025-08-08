import React from 'react';
import { TrendingUp, Calendar, Star, Users, MessageCircle, Trophy } from 'lucide-react';
import { ActivityItem } from '../../types/activity';
import { ActivityReactions } from './ActivityReactions';

interface ActivityCardProps {
  activity: ActivityItem;
  children: React.ReactNode;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, children }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'event_created':
        return <Calendar className="w-5 h-5 text-[#1E30FF]" />;
      case 'user_followed':
        return <Users className="w-5 h-5 text-[#489707]" />;
      case 'event_reviewed':
        return <Star className="w-5 h-5 text-[#f0900a]" />;
      case 'ticket_purchased':
        return <MessageCircle className="w-5 h-5 text-[#FF2D95]" />;
      case 'achievement_unlocked':
        return <Trophy className="w-5 h-5 text-[#489707]" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'event_created':
        return 'from-[#1E30FF]/10 to-[#FF2D95]/10 border-[#1E30FF]/20';
      case 'user_followed':
        return 'from-[#489707]/10 to-[#1E30FF]/10 border-[#489707]/20';
      case 'event_reviewed':
        return 'from-[#f0900a]/10 to-[#FF2D95]/10 border-[#f0900a]/20';
      case 'ticket_purchased':
        return 'from-[#FF2D95]/10 to-[#f0900a]/10 border-[#FF2D95]/20';
      case 'achievement_unlocked':
        return 'from-[#489707]/10 to-[#1E30FF]/10 border-[#489707]/20';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div 
      className={`bg-gradient-to-r ${getActivityColor(activity.activity_type)} rounded-xl border p-6 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start space-x-4">
        {/* Activity Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            {getActivityIcon(activity.activity_type)}
          </div>
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-gray-900 font-medium leading-relaxed">
                <span className="inline-block">{children}</span>
              </div>
              
              {/* Additional Details */}
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

              {/* Reactions and Comments */}
              <div className="mt-3 flex items-center justify-between">
                <ActivityReactions activity={activity} />
                <span className="text-xs text-gray-500">
                  {formatDate(activity.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
