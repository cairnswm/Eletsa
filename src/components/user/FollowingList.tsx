import React from 'react';
import { UserCheck } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserName } from './UserName';

interface FollowingListProps {
  userId: number;
  title?: string;
  showFollowButtons?: boolean;
  maxDisplay?: number;
  className?: string;
}

export const FollowingList: React.FC<FollowingListProps> = ({
  userId,
  title = 'Following',
  showFollowButtons = true,
  maxDisplay,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  const { getFollowing } = useUser();
  
  // Simply get the data - context handles fetching automatically
  const following = getFollowing(userId);
  const displayFollowing = maxDisplay ? following.slice(0, maxDisplay) : following;
  const hasMore = maxDisplay && following.length > maxDisplay;

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-[#489707]" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {following.length}
          </span>
        </div>
      </div>

      {following.length > 0 ? (
        <div className="space-y-3">
          {displayFollowing.map((follow) => (
            <div key={follow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <UserName 
                userId={follow.followed_user_id} 
                showFollowButton={showFollowButtons && currentUser?.id !== follow.followed_user_id}
                className="flex-1"
              />
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center pt-2">
              <span className="text-sm text-gray-500">
                and {following.length - maxDisplay!} more...
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {userId === currentUser?.id ? "You're not following anyone yet" : "Not following anyone yet"}
          </p>
        </div>
      )}
    </div>
  );
};