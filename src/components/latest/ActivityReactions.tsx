import React from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { ActivityItem } from '../../types/activity';
import { useActivity } from '../../contexts/useActivity';
import { useAuth } from '../../contexts/AuthContext';

interface ActivityReactionsProps {
  activity: ActivityItem;
}

export const ActivityReactions: React.FC<ActivityReactionsProps> = ({ activity }) => {
  const { likeActivity, unlikeActivity } = useActivity();
  const { user } = useAuth();

  const handleLikeClick = async () => {
    if (!user) return;
    
    if (activity.has_liked === 1) {
      await unlikeActivity(activity.id, user.id);
    } else {
      await likeActivity(activity.id, user.id);
    }
  };

  return (
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <button
        onClick={handleLikeClick}
        disabled={!user}
        className="flex items-center space-x-1 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ThumbsUp className={`w-4 h-4 ${activity.has_liked === 1 ? 'text-blue-500 fill-current' : 'text-gray-500'}`} />
        <span>
          {activity.total_reactions} {activity.total_reactions === 1 ? 'like' : 'likes'}
        </span>
      </button>
      {activity.total_comments > 0 && (
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4" />
          <span>
            {activity.total_comments} {activity.total_comments === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      )}
    </div>
  );
};
