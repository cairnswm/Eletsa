import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/10 via-white to-[#FF2D95]/10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
};