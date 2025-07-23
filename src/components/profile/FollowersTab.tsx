import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FollowersList } from '../user/FollowersList';

export const FollowersTab: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <FollowersList 
      userId={user.id} 
      title="Your Followers"
      showFollowButtons={true}
      className="shadow-none border-0 p-0"
    />
  );
};