import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { useUser } from '../hooks/useUser';

interface FollowButtonProps {
  targetUserId: string; // Updated type to string
  targetUserName: string;
  size?: 'sm' | 'md';
  variant?: 'icon' | 'button';
  className?: string;
  style?: React.CSSProperties;
}

export function FollowButton({ 
  targetUserId, 
  targetUserName, 
  size = 'sm', 
  variant = 'icon', 
  className = '', 
  style 
}: FollowButtonProps) {
  const { user, toggleFollow, isFollowing } = useUser();

  if (!user || user.id === targetUserId) {
    return null;
  }

  const following = isFollowing(targetUserId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(targetUserId);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        style={style}
        className={`inline-flex items-center justify-center transition-colors ${
          size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
        } ${
          following
            ? 'text-blue-600 hover:text-blue-700'
            : 'text-gray-400 hover:text-blue-600'
        } ${className}`}
        title={following ? `Unfollow ${targetUserName}` : `Follow ${targetUserName}`}
      >
        {following ? (
          <UserCheck className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        ) : (
          <UserPlus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      style={style}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
        following
          ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600'
      } ${className}`}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4 mr-1" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-1" />
          Follow
        </>
      )}
    </button>
  );
}