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

interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
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
  const [users, setUsers] = useState(usersData);
  const [follows, setFollows] = useState<Follow[]>(followsData);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure the user ID is a string (for backward compatibility)
      if (typeof parsedUser.id === 'number') {
        // Convert old numeric IDs to UUID format
        const userWithStringId = users.find(u => u.username === parsedUser.username);
        if (userWithStringId) {
          const { password: _, ...userWithoutPassword } = userWithStringId;
          setUser(userWithoutPassword);
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        }
      } else {
        setUser(parsedUser);
      }
    }
  }, [users]);

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

  const register = async (data: RegisterData): Promise<boolean> => {
    // Check if username or email already exists
    const existingUser = users.find(u => 
      u.username === data.username || u.email === data.email
    );
    
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      role: 'attendee' as const,
      credits: 100, // Welcome bonus
      fee: 0, // Attendees don't pay fees
      verified: false
    };

    // Add to users array
    setUsers(prev => [...prev, newUser]);

    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return true;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    // Find user with current password
    const userData = users.find(u => u.id === user.id && u.password === currentPassword);
    if (!userData) {
      return false; // Current password is incorrect
    }

    // Update password in users array
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, password: newPassword } : u
    ));

    return true;
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
      
      // Also update in the users array
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      ));
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
    return follows.some(
      follow => follow.followerId === user.id && follow.followingId === targetUserId
    );
  };

  const getFollowers = (userId: string) => {
    const followerIds = follows
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    
    return users.filter(user => followerIds.includes(user.id));
  };

  const getFollowing = (userId: string) => {
    const followingIds = follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    return users.filter(user => followingIds.includes(user.id));
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
      register,
      logout,
      changePassword,
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