import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProperty, AuthContextType, LoginRequest, RegisterRequest, UpdateUserRequest } from '../types/auth';
import { api } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has completed their profile
  const hasCompletedProfile = user ? 
    !!(user.username || (user.firstname && user.lastname)) : false;
  const clearError = () => {
    setError(null);
  };

  const fetchUserProperties = async (userId: number) => {
    try {
      const properties = await api.fetchUserProperties(userId);
      setUserProperties(properties);
    } catch (err) {
      console.error('Failed to fetch user properties:', err);
      // Don't set error for properties fetch failure
    }
  };

  const getUserProperty = (name: string): UserProperty | null => {
    return userProperties.find(prop => prop.name === name) || null;
  };

  const updateUserProperty = async (name: string, value: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      setError(null);
      await api.updateUserProperty(user.id, name, value);
      
      // Update local properties state
      setUserProperties(prev => {
        const existingIndex = prev.findIndex(prop => prop.name === name);
        if (existingIndex >= 0) {
          // Update existing property
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], value };
          return updated;
        } else {
          // Add new property
          return [...prev, {
            id: Date.now(), // Temporary ID - will be updated on next fetch
            user_id: user.id,
            name,
            value
          }];
        }
      });
      
      // Refresh properties to get the correct ID from server
      await fetchUserProperties(user.id);
    } catch (err) {
      console.error('Property update error:', err);
      setError(err instanceof Error ? err.message : 'Property update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const validateToken = async () => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.validateToken(storedToken);
      const userData: User = {
        id: response.id,
        email: response.email,
        username: response.username,
        firstname: response.firstname,
        lastname: response.lastname,
        avatar: response.avatar,
        role: response.role,
        app_id: response.app_id,
        permissions: response.permissions,
      };
      setUser(userData);
      setToken(storedToken);
      
      // Fetch user properties after successful token validation
      await fetchUserProperties(response.id);
      
      setError(null);
    } catch (err) {
      console.error('Token validation failed:', err);
      localStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
      // Don't set error for token validation failure on app load
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.login(credentials);
      
      const userData: User = {
        id: response.id,
        email: response.email,
        username: response.username,
        firstname: response.firstname,
        lastname: response.lastname,
        avatar: response.avatar,
        role: response.role,
        app_id: response.app_id,
        permissions: response.permissions,
      };

      setUser(userData);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      
      // Fetch user properties after successful login
      await fetchUserProperties(response.id);
      
      console.log('Login successful, token stored:', response.token);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.register(credentials);
      
      const userData: User = {
        id: response.id,
        email: response.email,
        username: response.username,
        firstname: response.firstname,
        lastname: response.lastname,
        avatar: response.avatar,
        role: response.role,
        app_id: response.app_id,
        permissions: response.permissions,
      };

      setUser(userData);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      
      // Fetch user properties after successful registration
      await fetchUserProperties(response.id);
      
      console.log('Registration successful, token stored:', response.token);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserProperties([]);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth_token');
    console.log('User logged out, token cleared');
  };

  const updateProfile = async (data: UpdateUserRequest) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      setError(null);
      await api.updateUser(user.id, data);
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const value: AuthContextType = {
    user,
    userProperties,
    token,
    hasCompletedProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updateUserProperty,
    getUserProperty,
    validateToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};