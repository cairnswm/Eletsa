import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

import { users as usersData } from '../data/users';
import { follows as followsData } from '../data/follows';
import { User, Follow, RegisterData, UserContextType } from '../types/user.types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(usersData);
  const [follows, setFollows] = useState<Follow[]>(followsData);    

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(storedUser as User);
    }
  }, []);

  const login = async (username: string): Promise<boolean> => {
    const userData = users.find(u => u.username === username);
    if (userData) {
      setUser(userData as User);
      saveToLocalStorage('currentUser', userData);
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const existingUser = users.find(u => u.username === data.username || u.email === data.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: data.username,
      name: data.name,
      email: data.email || '', // Ensure email is defined
      role: 'attendee',
      credits: 100,
      fee: 0,
      verified: false,
      password: data.password, // Added missing property
      bio: '',
      phone: ''
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    saveToLocalStorage('currentUser', newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    saveToLocalStorage('currentUser', null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveToLocalStorage('currentUser', updatedUser);
    }
  };

  const toggleFollow = (targetUserId: string) => {
    if (!user || user.id === targetUserId) return;

    const existingFollow = follows.find(
      follow => follow.followerId === user.id && follow.followingId === targetUserId
    );

    if (existingFollow) {
      setFollows(prev => prev.filter(follow => follow.id !== existingFollow.id));
    } else {
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

  const getFollowers = (userId: string): User[] => {
    const followerIds = follows
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    return users.filter(user => followerIds.includes(user.id)) as User[];
  };

  const getFollowing = (userId: string): User[] => {
    const followingIds = follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    return users.filter(user => followingIds.includes(user.id)) as User[];
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (user && user.password === currentPassword) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      saveToLocalStorage('currentUser', updatedUser);
      return true;
    }
    return false;
  };

  const updateVerificationStatus = (userId: string): void => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const updatedUser: User = {
        ...targetUser,
        verified: true,
        email: targetUser.email || '', // Ensure email is defined
        role: targetUser.role as 'attendee' | 'organizer' | 'admin'
      };
      setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));
      if (user?.id === userId) {
        setUser(updatedUser);
        saveToLocalStorage('currentUser', updatedUser);
      }
    }
  };

  const isFollowMutual = (userId: string, targetUserId: string): boolean => {
    return follows.some(
      follow => follow.followerId === userId && follow.followingId === targetUserId
    ) && follows.some(
      follow => follow.followerId === targetUserId && follow.followingId === userId
    );
  };

  const checkVerificationStatus = (userId: string): boolean => {
    const targetUser = users.find(u => u.id === userId);
    return targetUser?.verified ?? false;
  };

  const calculateNetRevenue = (grossRevenue: number, userId: string): number => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      return grossRevenue - targetUser.fee;
    }
    return grossRevenue;
  };

  const getPlatformFee = (grossRevenue: number, userId: string): number => {
    const targetUser = users.find(u => u.id === userId);
    return targetUser ? grossRevenue * (targetUser.fee / 100) : 0; // Use grossRevenue in calculation
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      register,
      logout,
      changePassword,
      isOrganizer: user?.role === 'organizer',
      isAdmin: user?.role === 'admin',
      isAttendee: user?.role === 'attendee',
      updateUser,
      toggleFollow,
      isFollowing,
      getFollowers,
      getFollowing,
      isFollowMutual,
      checkVerificationStatus,
      updateVerificationStatus,
      calculateNetRevenue,
      getPlatformFee,
      getUserById,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };