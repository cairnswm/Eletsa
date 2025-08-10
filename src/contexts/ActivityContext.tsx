import React, { createContext, useState, useEffect } from 'react';
import { ActivityItem, ActivityComment, ActivityContextType } from '../types/activity';
import { activityApi } from '../services/activity';
import { useAuth } from './AuthContext';

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityComments, setActivityComments] = useState<{ [activityId: number]: ActivityComment[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchActivities = React.useCallback(async () => {
    if (!user) {
      setActivities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const activitiesData = await activityApi.fetchUserActivityFeed(user.id);
      // Sort activities by modified_at descending (newest first)
      const sortedActivities = activitiesData.sort((a, b) => 
        new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
      );
      setActivities(sortedActivities);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshActivities = async () => {
    await fetchActivities();
  };

  const fetchActivityComments = async (activityId: number) => {
    // Don't fetch if already cached
    if (activityComments[activityId]) {
      return;
    }

    try {
      setError(null);
      const comments = await activityApi.fetchActivityComments(activityId);
      setActivityComments(prev => ({
        ...prev,
        [activityId]: comments
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activity comments';
      setError(errorMessage);
      console.error('Failed to fetch activity comments:', err);
    }
  };

  const getActivityComments = (activityId: number): ActivityComment[] => {
    return activityComments[activityId] || [];
  };

  const addActivityComment = async (activityId: number, content: string, userId: number) => {
    try {
      setError(null);
      const newComment = await activityApi.createActivityComment(activityId, content, userId);
      
      // Add comment to cache
      setActivityComments(prev => ({
        ...prev,
        [activityId]: [...(prev[activityId] || []), newComment]
      }));

      // Update the activity's comment count
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, total_comments: activity.total_comments + 1 }
          : activity
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      console.error('Failed to add activity comment:', err);
      throw err;
    }
  };

  const likeActivity = async (activityId: number, userId: number) => {
    try {
      await activityApi.likeActivity(activityId, userId);
      // Update the local state optimistically
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              has_liked: 1,
              total_reactions: activity.total_reactions + 1 
            }
          : activity
      ));
    } catch (err) {
      console.error('Failed to like activity:', err);
    }
  };

  const unlikeActivity = async (activityId: number, userId: number) => {
    try {
      await activityApi.unlikeActivity(activityId, userId);
      // Update the local state optimistically
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              has_liked: 0,
              total_reactions: Math.max(0, activity.total_reactions - 1) 
            }
          : activity
      ));
    } catch (err) {
      console.error('Failed to unlike activity:', err);
    }
  };

  // Fetch activities when user changes
  useEffect(() => {
    if (user) {
      fetchActivities();
    } else {
      setActivities([]);
      setActivityComments({});
      setError(null);
    }
  }, [user, fetchActivities]);

  // Clear activities when user logs out
  useEffect(() => {
    if (!user) {
      setActivities([]);
      setActivityComments({});
      setError(null);
    }
  }, [user]);

  const value: ActivityContextType = {
    activities,
    activityComments,
    loading,
    error,
    fetchActivities,
    refreshActivities,
    clearError,
    likeActivity,
    unlikeActivity,
    fetchActivityComments,
    getActivityComments,
    addActivityComment,
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export { ActivityContext }