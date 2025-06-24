import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { users as usersData } from '../data/users';
import { follows as followsData } from '../data/follows';

interface User {
  id: number;
  username: string;
  name: string;
  role: 'attendee' | 'organizer' | 'admin';
  email?: string;
  bio?: string;
  phone?: string;
  credits?: number;
}

interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  timestamp: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isOrganizer: boolean;
  isAdmin: boolean;
  isAttendee: boolean;
  updateUser: (updates: Partial<User>) => void;
  toggleFollow: (targetUserId: number) => void;
  isFollowing: (targetUserId: number) => boolean;
  getFollowers: (userId: number) => User[];
  getFollowing: (userId: number) => User[];
  isFollowMutual: (userId: number, targetUserId: number) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users] = useState(usersData);
  const [follows, setFollows] = useState<Follow[]>(followsData);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const userData = users.find(u => u.username === username && u.password === password);
    if (userData) {
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const toggleFollow = (targetUserId: number) => {
    if (!user || user.id === targetUserId) return;

    const existingFollow = follows.find(
      follow => follow.followerId === user.id && follow.followingId === targetUserId
    );

    if (existingFollow) {
      // Unfollow
      setFollows(prev => prev.filter(follow => follow.id !== existingFollow.id));
    } else {
      // Follow
      const newFollow: Follow = {
        id: Date.now(),
        followerId: user.id,
        followingId: targetUserId,
        timestamp: new Date().toISOString()
      };
      setFollows(prev => [...prev, newFollow]);
    }
  };

  const isFollowing = (targetUserId: number) => {
    if (!user) return false;
    return follows.some(
      follow => follow.followerId === user.id && follow.followingId === targetUserId
    );
  };

  const getFollowers = (userId: number) => {
    const followerIds = follows
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    
    return users.filter(user => followerIds.includes(user.id));
  };

  const getFollowing = (userId: number) => {
    const followingIds = follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    return users.filter(user => followingIds.includes(user.id));
  };

  const isFollowMutual = (userId: number, targetUserId: number) => {
    const userFollowsTarget = follows.some(
      follow => follow.followerId === userId && follow.followingId === targetUserId
    );
    const targetFollowsUser = follows.some(
      follow => follow.followerId === targetUserId && follow.followingId === userId
    );
    
    return userFollowsTarget && targetFollowsUser;
  };

  const isOrganizer = user?.role === 'organizer';
  const isAdmin = user?.role === 'admin';
  const isAttendee = user?.role === 'attendee';

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      isOrganizer,
      isAdmin,
      isAttendee,
      updateUser,
      toggleFollow,
      isFollowing,
      getFollowers,
      getFollowing,
      isFollowMutual
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}