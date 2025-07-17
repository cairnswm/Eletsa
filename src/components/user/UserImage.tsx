import React from 'react';
import { User } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface UserImageProps {
  userId: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineIndicator?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8', 
  xl: 'w-10 h-10'
};

export const UserImage: React.FC<UserImageProps> = ({ 
  userId, 
  size = 'lg',
  className = '',
  showOnlineIndicator = false
}) => {
  const { getUser } = useUser();
  
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

  const getInitials = () => {
    if (!userProfile) {
      return userId.toString().slice(-1);
    }
    
    if (userProfile.firstname && userProfile.lastname) {
      return `${userProfile.firstname[0]}${userProfile.lastname[0]}`;
    }
    if (userProfile.firstname) {
      return userProfile.firstname[0];
    }
    if (userProfile.username) {
      return userProfile.username[0];
    }
    return userProfile.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center overflow-hidden`}>
        {userProfile?.avatar ? (
          <img 
            src={userProfile.avatar} 
            alt={getDisplayName()} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-medium text-sm">
            {getInitials()}
          </span>
        )}
      </div>
      
      {/* Online Indicator */}
      {showOnlineIndicator && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};