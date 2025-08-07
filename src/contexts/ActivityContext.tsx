import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActivityItem, ActivityContextType } from '../types/activity';
import { activityApi } from '../services/activity';
import { useAuth } from './AuthContext';

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
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
      setActivities(activitiesData);
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

  // Fetch activities when user changes
  useEffect(() => {
    if (user) {
      fetchActivities();
    } else {
      setActivities([]);
      setError(null);
    }
  }, [user?.id, fetchActivities]);

  // Clear activities when user logs out
  useEffect(() => {
    if (!user) {
      setActivities([]);
      setError(null);
    }
  }, [user]);

  const value: ActivityContextType = {
    activities,
    loading,
    error,
    fetchActivities,
    refreshActivities,
    clearError,
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};