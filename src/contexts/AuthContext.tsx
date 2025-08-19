import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, LoginRequest, RegisterRequest, UpdateUserRequest } from '../types/auth';
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has completed their profile
  const hasCompletedProfile = user ? 
    !!(user.username || (user.firstname && user.lastname)) : false;
  const clearError = () => {
    setError(null);
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
        vat_number: response.vat_number,
      };
      setUser(userData);
      setToken(storedToken);
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
        vat_number: response.vat_number,
      };

      setUser(userData);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      
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
        vat_number: response.vat_number,
      };

      setUser(userData);
      setToken(response.token);
      localStorage.setItem('auth_token', response.token);
      
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
    token,
    hasCompletedProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    validateToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};