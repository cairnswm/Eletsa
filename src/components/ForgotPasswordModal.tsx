import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Calendar
} from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onSwitchToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, we'll always show success
      // In a real app, you'd check if the email exists in your system
      setShowSuccess(true);

    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (isSubmitting) return;
    
    onClose();
    setEmail('');
    setError('');
    setShowSuccess(false);
  };

  const handleBackToLogin = () => {
    closeModal();
    onSwitchToLogin();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Success State */}
        {showSuccess && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                Back to Login
              </button>
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          </div>
        )}

        {/* Reset Form */}
        {!showSuccess && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Reset Password</h3>
                  <p className="text-gray-600 text-sm">Enter your email to receive a reset link</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-pink-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={handleBackToLogin}
                disabled={isSubmitting}
                className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}