import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Calendar, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/discover');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (user: string, pass: string, name: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
    setIsLoading(true);

    try {
      const success = await login(user, pass);
      if (success) {
        navigate('/discover');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Calendar className="h-12 w-12 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Eletsa</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-pink-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Quick Login for Demo */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">Quick login for demo:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => quickLogin('thabo', 'pass123', 'Thabo (Attendee)')}
                className="text-left px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <span className="font-medium">Thabo</span> - Attendee
              </button>
              <button
                onClick={() => quickLogin('lerato', 'organize1', 'Lerato (Organizer)')}
                className="text-left px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <span className="font-medium">Lerato</span> - Organizer
              </button>
              <button
                onClick={() => quickLogin('admin', 'admin123', 'Admin User')}
                className="text-left px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <span className="font-medium">Admin</span> - Administrator
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          New to Eletsa?{' '}
          <Link to="/discover" className="text-blue-600 hover:text-blue-500 font-medium">
            Browse events as guest
          </Link>
        </p>
      </div>
    </div>
  );
}