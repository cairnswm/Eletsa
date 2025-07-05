import React from 'react';
import { Users } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserName } from './UserName';

interface FollowersListProps {
  userId: number;
  title?: string;
  showFollowButtons?: boolean;
  maxDisplay?: number;
  className?: string;
}

export const FollowersList: React.FC<FollowersListProps> = ({
  userId,
  title = 'Followers',
  showFollowButtons = true,
  maxDisplay,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  const { getFollowers } = useUser();
  
  // Simply get the data - context handles fetching automatically
  const followers = getFollowers(userId);
  const displayFollowers = maxDisplay ? followers.slice(0, maxDisplay) : followers;
  const hasMore = maxDisplay && followers.length > maxDisplay;

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#1E30FF]" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {followers.length}
          </span>
        </div>
      </div>

      {followers.length > 0 ? (
        <div className="space-y-3">
          {displayFollowers.map((follower) => (
            <div key={follower.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <UserName 
                userId={follower.follower_user_id} 
                showFollowButton={showFollowButtons && currentUser?.id !== follower.follower_user_id}
                className="flex-1"
              />
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center pt-2">
              <span className="text-sm text-gray-500">
                and {followers.length - maxDisplay!} more...
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {userId === currentUser?.id ? "You don't have any followers yet" : "No followers yet"}
          </p>
        </div>
      )}
    </div>
  );
};