import React from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';

interface UserNameProps {
  userId: number;
  showFollowButton?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const UserName: React.FC<UserNameProps> = ({ 
  userId, 
  showFollowButton = true, 
  showIcon = true,
  className = '' 
}) => {
  const { user: currentUser } = useAuth();
  const { 
    getUser, 
    isFollowing, 
    followUser, 
    unfollowUser, 
    loading 
  } = useUser();
  
  const [followLoading, setFollowLoading] = React.useState(false);

  // Simply get the user from cache - context handles fetching automatically
  const userProfile = getUser(userId);

  const getDisplayName = () => {
    if (!userProfile) {
      return `User ${userId}`;
    }
    
    if (userProfile.firstname && userProfile.lastname) {
      return `${userProfile.firstname} ${userProfile.lastname}`;
    }
    if (userProfile.username) {
      return userProfile.username;
    }
    if (userProfile.email) {
      return userProfile.email;
    }
    return `User ${userId}`;
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !userProfile || followLoading) return;
    
    // Don't allow following yourself
    if (currentUser.id === userProfile.id) return;

    try {
      setFollowLoading(true);
      
      if (isFollowing(currentUser.id, userProfile.id)) {
        await unfollowUser(currentUser.id, userProfile.id);
      } else {
        await followUser(currentUser.id, userProfile.id);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const isCurrentUserFollowing = currentUser ? isFollowing(currentUser.id, userId) : false;
  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* User Avatar */}
      {showIcon && (
        <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
          {userProfile?.avatar ? (
            <img 
              src={userProfile.avatar} 
              alt={getDisplayName()} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {getDisplayName()[0].toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* User Name */}
      <span className="font-medium text-gray-900 hover:text-[#1E30FF] transition-colors duration-200 cursor-pointer">
        {getDisplayName()}
      </span>

      {/* Follow Button */}
      {showFollowButton && currentUser && !isOwnProfile && userProfile && (
        <button
          onClick={handleFollowToggle}
          disabled={followLoading || loading}
          className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 text-[#1E30FF] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isCurrentUserFollowing ? 'Unfollow user' : 'Follow user'}
        >
          {followLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isCurrentUserFollowing ? (
            <UserCheck className="w-3 h-3 text-[#489707]" />
          ) : (
            <UserPlus className="w-3 h-3 text-[#1E30FF]" />
          )}
          
        </button>
      )}
    </div>
  );
};