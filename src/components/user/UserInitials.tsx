import React from 'react';
import { useUser } from '../../contexts/UserContext';

interface UserInitialsProps {
  userId: number;
  className?: string;
}

export const UserInitials: React.FC<UserInitialsProps> = ({ userId, className }) => {
  const { getUser } = useUser();
  const user = getUser(userId);

  const getInitials = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname[0]}${user.lastname[0]}`;
    }
    if (user?.firstname) {
      return user.firstname[0];
    }
    if (user?.username) {
      return user.username[0];
    }
    if (userId) {
      return userId.toString();
    }
    return 'N/A';
  };

  return (
    <div
      className={`w-8 h-8 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center text-white text-xs font-medium ${className}`}
    >
      {getInitials()}
    </div>
  );
};
