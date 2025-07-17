import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, FollowRelation, UserContextType } from '../types/user';
import { usersApi } from '../services/users';
import { useAuth } from './AuthContext';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followRelations, setFollowRelations] = useState<FollowRelation[]>([]);
  const [followDataFetched, setFollowDataFetched] = useState<Set<number>>(new Set());
  const [followerDataFetched, setFollowerDataFetched] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const getUser = (userId: number): UserProfile | null => {
    const user = users.find(user => user.id === userId);
    
    // If user doesn't exist in cache, automatically fetch it
    if (!user) {
      fetchUserInternal(userId);
      return null; // Return null for now, will be available on next render
    }
    
    return user;
  };

  const isFollowing = (followerUserId: number, followedUserId: number): boolean => {
    const result = followRelations.some(
      relation => relation.follower_user_id === followerUserId && relation.followed_user_id === followedUserId
    );
        
    return result;
  };

  const isFollowedBy = (userId: number, followerId: number): boolean => {
    return followRelations.some(
      relation => relation.follower_user_id === followerId && relation.followed_user_id === userId
    );
  };

  const getFollowRelation = (followerUserId: number, followedUserId: number): FollowRelation | null => {
    return followRelations.find(
      relation => relation.follower_user_id === followerUserId && relation.followed_user_id === followedUserId
    ) || null;
  };

  const getFollowers = (userId: number): FollowRelation[] => {
    // Auto-fetch follower data if not already fetched
    if (!followerDataFetched.has(userId)) {
      fetchUserFollowersInternal(userId);
    }
    
    return followRelations.filter(relation => relation.followed_user_id === userId);
  };

  const getFollowing = (userId: number): FollowRelation[] => {
    // Auto-fetch following data if not already fetched
    if (!followDataFetched.has(userId)) {
      fetchUserFollowsInternal(userId);
    }
    
    return followRelations.filter(relation => relation.follower_user_id === userId);
  };

  // Internal fetch function - only called by context, never by components
  const fetchUserInternal = async (userId: number): Promise<UserProfile> => {
    // Check if user is already cached
    const cachedUser = users.find(user => user.id === userId);
    if (cachedUser) {
      return cachedUser;
    }

    // Create user record immediately with minimal data
    const userRecord: UserProfile = {
      id: userId,
      email: '',
      username: null,
      firstname: null,
      lastname: null,
      avatar: null,
      role: null,
      app_id: '',
      created_at: '',
      modified_at: '',
    };

    // Add to cache immediately
    setUsers(prev => [...prev, userRecord]);

    // Try to fetch details once - never retry regardless of outcome
    try {
      const userData = await usersApi.fetchUser(userId);
      
      // Update cache with real user data
      setUsers(prev => prev.map(user => 
        user.id === userId ? userData : user
      ));
      
      return userData;
    } catch (err) {
      console.error(`Failed to fetch user ${userId}:`, err);
      
      // Return the minimal user record - don't remove from cache, don't retry
      return userRecord;
    }
  };

  // Public fetch function - for explicit fetching (like from event handlers)
  const fetchUser = async (userId: number): Promise<UserProfile> => {
    return fetchUserInternal(userId);
  };

  const fetchBulkUsersFromRelations = async (relations: FollowRelation[]): Promise<void> => {
    // Extract all unique user IDs from the relations
    const userIds = new Set<number>();
    relations.forEach(relation => {
      userIds.add(relation.follower_user_id);
      userIds.add(relation.followed_user_id);
    });

    // Filter out users we already have cached
    const uncachedUserIds = Array.from(userIds).filter(userId => 
      !users.find(user => user.id === userId)
    );
    
    if (uncachedUserIds.length === 0) {
      return; // All users are already cached
    }

    // Add minimal user records to cache immediately
    const userRecords: UserProfile[] = uncachedUserIds.map(userId => ({
      id: userId,
      email: '',
      username: null,
      firstname: null,
      lastname: null,
      avatar: null,
      role: null,
      app_id: '',
      created_at: '',
      modified_at: '',
    }));
    
    setUsers(prev => [...prev, ...userRecords]);
    
    // Try to fetch actual user data once - never retry
    try {
      const bulkUsers = await usersApi.fetchBulkUsers(uncachedUserIds);
      
      // Update cache with real user data for users that were returned
      setUsers(prev => prev.map(user => {
        const realUser = bulkUsers.find(bulkUser => bulkUser.id === user.id);
        return realUser || user; // Keep minimal record if user wasn't returned
      }));
    } catch (err) {
      console.error('Failed to fetch bulk users:', err);
      // Keep the minimal records in cache - don't remove, don't retry
    }
  };

  // Internal follow data fetching - called automatically by getters
  const fetchUserFollowsInternal = async (userId: number): Promise<void> => {
    // Check if we've already fetched follow data for this user
    if (followDataFetched.has(userId)) {
      return;
    }

    // Mark as fetched immediately to prevent duplicate requests
    setFollowDataFetched(prev => new Set([...prev, userId]));

    try {
      setError(null);
      const followsData = await usersApi.getUserFollows(userId);
      
      // Add new follow relations to cache
      setFollowRelations(prev => {
        const newRelations = followsData.filter(
          newRel => !prev.some(existingRel => existingRel.id === newRel.id)
        );
        return [...prev, ...newRelations];
      });

      // Bulk fetch users from the new relations
      await fetchBulkUsersFromRelations(followsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user follows';
      setError(errorMessage);
      console.error('Failed to fetch user follows:', err);
    }
  };

  const fetchUserFollowersInternal = async (userId: number): Promise<void> => {
    // Check if we've already fetched follower data for this user
    if (followerDataFetched.has(userId)) {
      return;
    }

    // Mark as fetched immediately to prevent duplicate requests
    setFollowerDataFetched(prev => new Set([...prev, userId]));

    try {
      setError(null);
      const followersData = await usersApi.getUserFollowers(userId);
      
      // Add new follow relations to cache
      setFollowRelations(prev => {
        const newRelations = followersData.filter(
          newRel => !prev.some(existingRel => existingRel.id === newRel.id)
        );
        return [...prev, ...newRelations];
      });

      // Bulk fetch users from the new relations
      await fetchBulkUsersFromRelations(followersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user followers';
      setError(errorMessage);
      console.error('Failed to fetch user followers:', err);
    }
  };

  // Public fetch functions - for explicit fetching (like from event handlers)
  const fetchUserFollows = async (userId: number): Promise<void> => {
    return fetchUserFollowsInternal(userId);
  };

  const fetchUserFollowers = async (userId: number): Promise<void> => {
    return fetchUserFollowersInternal(userId);
  };

  const followUser = async (followerUserId: number, followedUserId: number): Promise<void> => {
    // Check if already following (prevent duplicate requests)
    if (isFollowing(followerUserId, followedUserId)) {
      console.log('Already following, skipping');
      return;
    }

    console.log(`Starting follow process: ${followerUserId} -> ${followedUserId}`);

    // OPTIMISTIC UPDATE: Add follow relation immediately
    const optimisticFollowRelation: FollowRelation = {
      id: Date.now(), // Temporary ID
      follower_user_id: followerUserId,
      followed_user_id: followedUserId,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };

    console.log('Adding optimistic follow relation:', optimisticFollowRelation);

    // Update cache immediately for instant UI feedback
    setFollowRelations(prev => {
      const newRelations = [...prev, optimisticFollowRelation];
      console.log('Updated follow relations:', newRelations);
      return newRelations;
    });

    // Ensure the followed user is in cache
    const existingUser = users.find(user => user.id === followedUserId);
    if (!existingUser) {
      const minimalUser: UserProfile = {
        id: followedUserId,
        email: '',
        username: null,
        firstname: null,
        lastname: null,
        avatar: null,
        role: null,
        app_id: '',
        created_at: '',
        modified_at: '',
      };
      setUsers(prev => [...prev, minimalUser]);
    }

    try {
      setLoading(true);
      setError(null);
      
      // Make the API call
      const realFollowRelation = await usersApi.followUser(followerUserId, followedUserId);
      
      console.log('Received real follow relation:', realFollowRelation);
      
      // Replace the optimistic relation with the real one
      setFollowRelations(prev => {
        const updatedRelations = prev.map(relation => 
          relation.id === optimisticFollowRelation.id ? realFollowRelation : relation
        );
        console.log('Replaced optimistic with real relation:', updatedRelations);
        return updatedRelations;
      });

      // Try to fetch the actual user details in the background
      if (!existingUser) {
        fetchUserInternal(followedUserId).catch(err => {
          console.error('Failed to fetch followed user details:', err);
        });
      }
    } catch (err) {
      console.error('Follow API call failed:', err);
      
      // If API call fails, remove the optimistic relation
      setFollowRelations(prev => {
        const filteredRelations = prev.filter(relation => relation.id !== optimisticFollowRelation.id);
        console.log('Removed optimistic relation due to error:', filteredRelations);
        return filteredRelations;
      });
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to follow user';
      setError(errorMessage);
      console.error('Failed to follow user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (followerUserId: number, followedUserId: number): Promise<void> => {
    const followRelation = getFollowRelation(followerUserId, followedUserId);
    if (!followRelation) {
      throw new Error('Follow relationship not found');
    }

    console.log(`Starting unfollow process: ${followerUserId} -> ${followedUserId}`);
    console.log('Removing follow relation:', followRelation);

    // OPTIMISTIC UPDATE: Remove follow relation immediately
    setFollowRelations(prev => {
      const filteredRelations = prev.filter(relation => relation.id !== followRelation.id);
      console.log('Updated follow relations after unfollow:', filteredRelations);
      return filteredRelations;
    });

    try {
      setLoading(true);
      setError(null);
      
      // Make the API call
      await usersApi.unfollowUser(followRelation.id);
      
      console.log('Unfollow API call successful');
      
    } catch (err) {
      console.error('Unfollow API call failed:', err);
      
      // If API call fails, restore the follow relation
      setFollowRelations(prev => {
        const restoredRelations = [...prev, followRelation];
        console.log('Restored follow relation due to error:', restoredRelations);
        return restoredRelations;
      });
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to unfollow user';
      setError(errorMessage);
      console.error('Failed to unfollow user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user's follow data when user changes
  useEffect(() => {
    if (currentUser) {
      // Fetch both follows and followers data for the current user
      fetchUserFollowsInternal(currentUser.id).catch(console.error);
      fetchUserFollowersInternal(currentUser.id).catch(console.error);
    }
  }, [currentUser?.id]);

  // Clear all data when user logs out
  useEffect(() => {
    if (!currentUser) {
      setFollowRelations([]);
      setFollowDataFetched(new Set());
      setFollowerDataFetched(new Set());
      setUsers([]);
    }
  }, [currentUser]);

  const value: UserContextType = {
    users,
    followRelations,
    loading,
    error,
    fetchUser,
    getUser,
    isFollowing,
    isFollowedBy,
    getFollowRelation,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    fetchUserFollows,
    fetchUserFollowers,
    fetchBulkUsersFromRelations,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};