import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { users as usersData } from '../data/users';
import { follows as followsData } from '../data/follows';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'attendee' | 'organizer' | 'admin';
  email?: string;
  bio?: string;
  phone?: string;
  credits?: number;
  fee: number; // Platform fee percentage (0-100)
  verified: boolean; // Verification status
}

interface Follow {
  id: string;
  followerId: string;
  followingId: string;
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
  toggleFollow: (targetUserId: string) => void;
  isFollowing: (targetUserId: string) => boolean;
  getFollowers: (userId: string) => User[];
  getFollowing: (userId: string) => User[];
  isFollowMutual: (userId: string, targetUserId: string) => boolean;
  checkVerificationStatus: (userId: string) => boolean;
  updateVerificationStatus: (userId: string) => void;
  calculateNetRevenue: (grossRevenue: number, userId: string) => number;
  getPlatformFee: (grossRevenue: number, userId: string) => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users] = useState(usersData);
  const [follows, setFollows] = useState<Follow[]>(followsData);

  // Debug logging
  useEffect(() => {
    console.log('UserContext Debug:');
    console.log('Current user:', user);
    console.log('All follows data:', follows);
    console.log('All users data:', users);
    
    if (user) {
      const userFollowers = getFollowers(user.id);
      const userFollowing = getFollowing(user.id);
      console.log(`Followers for user ${user.id} (${user.name}):`, userFollowers);
      console.log(`Following for user ${user.id} (${user.name}):`, userFollowing);
    }
  }, [user, follows, users]);

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

  const toggleFollow = (targetUserId: string) => {
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
        id: `follow-${Date.now()}`,
        followerId: user.id,
        followingId: targetUserId,
        timestamp: new Date().toISOString()
      };
      setFollows(prev => [...prev, newFollow]);
    }
  };

  const isFollowing = (targetUserId: string) => {
    if (!user) return false;
    const result = follows.some(
      follow => follow.followerId === user.id && follow.followingId === targetUserId
    );
    console.log(`isFollowing check: ${user.id} -> ${targetUserId} = ${result}`);
    return result;
  };

  const getFollowers = (userId: string) => {
    console.log(`Getting followers for userId: ${userId}`);
    const followerIds = follows
      .filter(follow => {
        console.log(`Checking follow: ${follow.followerId} -> ${follow.followingId}, target: ${userId}`);
        return follow.followingId === userId;
      })
      .map(follow => follow.followerId);
    
    console.log(`Follower IDs for ${userId}:`, followerIds);
    
    const followerUsers = users.filter(user => {
      const isFollower = followerIds.includes(user.id);
      console.log(`User ${user.id} (${user.name}) is follower: ${isFollower}`);
      return isFollower;
    });
    
    console.log(`Follower users for ${userId}:`, followerUsers);
    return followerUsers;
  };

  const getFollowing = (userId: string) => {
    console.log(`Getting following for userId: ${userId}`);
    const followingIds = follows
      .filter(follow => {
        console.log(`Checking follow: ${follow.followerId} -> ${follow.followingId}, source: ${userId}`);
        return follow.followerId === userId;
      })
      .map(follow => follow.followingId);
    
    console.log(`Following IDs for ${userId}:`, followingIds);
    
    const followingUsers = users.filter(user => {
      const isFollowing = followingIds.includes(user.id);
      console.log(`User ${user.id} (${user.name}) is following: ${isFollowing}`);
      return isFollowing;
    });
    
    console.log(`Following users for ${userId}:`, followingUsers);
    return followingUsers;
  };

  const isFollowMutual = (userId: string, targetUserId: string) => {
    const userFollowsTarget = follows.some(
      follow => follow.followerId === userId && follow.followingId === targetUserId
    );
    const targetFollowsUser = follows.some(
      follow => follow.followerId === targetUserId && follow.followingId === userId
    );
    
    return userFollowsTarget && targetFollowsUser;
  };

  const checkVerificationStatus = (userId: string) => {
    const userData = users.find(u => u.id === userId);
    if (!userData) return false;
    
    // Admins are always verified
    if (userData.role === 'admin') return true;
    
    // For organizers, check if they have at least 2 completed events
    if (userData.role === 'organizer') {
      // This would need to be implemented with actual event data
      // For now, we'll use the verified status from the user data
      return userData.verified;
    }
    
    // Attendees can be verified but don't need special requirements
    return userData.verified;
  };

  const updateVerificationStatus = (userId: string) => {
    // This function would be called when an organizer reaches 2 completed events
    // It would update the user's verified status in the database
    if (user && user.id === userId) {
      updateUser({ verified: true });
    }
  };

  const calculateNetRevenue = (grossRevenue: number, userId: string) => {
    const userData = users.find(u => u.id === userId);
    if (!userData) return grossRevenue;
    
    const platformFee = (grossRevenue * userData.fee) / 100;
    return grossRevenue - platformFee;
  };

  const getPlatformFee = (grossRevenue: number, userId: string) => {
    const userData = users.find(u => u.id === userId);
    if (!userData) return 0;
    
    return (grossRevenue * userData.fee) / 100;
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
      isFollowMutual,
      checkVerificationStatus,
      updateVerificationStatus,
      calculateNetRevenue,
      getPlatformFee
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