import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FollowingList } from '../user/FollowingList';

export const FollowingTab: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <FollowingList 
      userId={user.id} 
      title="People You Follow"
      showFollowButtons={true}
      className="shadow-none border-0 p-0"
    />
  );
};