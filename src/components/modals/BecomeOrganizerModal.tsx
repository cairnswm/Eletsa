import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { 
  X, 
  Star, 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface BecomeOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BecomeOrganizerModal({ isOpen, onClose }: BecomeOrganizerModalProps) {
  const { user, updateUser } = useUser();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleUpgrade = async () => {
    if (!acceptedTerms || isUpgrading) return;

    setIsUpgrading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user role to organizer
      updateUser({ 
        role: 'organizer',
        fee: 20, // 20% platform fee for new organizers
        verified: false // New organizers start unverified
      });

      setShowSuccess(true);

      // Close modal after showing success
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setAcceptedTerms(false);
        setIsUpgrading(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to upgrade account:', error);
      setIsUpgrading(false);
    }
  };

  const closeModal = () => {
    if (isUpgrading) return; // Prevent closing during upgrade
    
    onClose();
    setAcceptedTerms(false);
    setShowSuccess(false);
    setIsUpgrading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Success State */}
        {showSuccess && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Eletsa Organizers!</h3>
            <p className="text-gray-600">Your account has been upgraded successfully. You can now start creating events.</p>
          </div>
        )}

        {/* Main Content */}
        {!showSuccess && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Become an Event Organizer</h3>
                <p className="text-gray-600 mt-1">Start creating and managing your own events</p>
              </div>
              <button
                onClick={closeModal}
                disabled={isUpgrading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Benefits Section */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">What you'll get as an organizer:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Create Events</h5>
                    <p className="text-sm text-gray-600">Design and publish unlimited events</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Earn Revenue</h5>
                    <p className="text-sm text-gray-600">Generate income from ticket sales</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Build Community</h5>
                    <p className="text-sm text-gray-600">Connect with attendees and grow your following</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Get Reviews</h5>
                    <p className="text-sm text-gray-600">Receive feedback and build your reputation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Terms and Conditions</h4>
              
              {/* Platform Fee */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900">Platform Fee</h5>
                    <p className="text-sm text-yellow-700 mt-1">
                      We charge a <strong>20% platform fee</strong> on all ticket sales for new organizers. 
                      This fee reduces to <strong>15%</strong> once you become a verified organizer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900">Payment Schedule</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>Unverified organizers:</strong> Payments are processed 7-10 business days after your event ends.<br />
                      <strong>Verified organizers:</strong> Payments are processed 3-5 business days after your event ends.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Requirements */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-green-900">Verification Requirements</h5>
                    <p className="text-sm text-green-700 mt-1">
                      To become a verified organizer and enjoy reduced fees and faster payouts, 
                      you need to successfully complete <strong>2 events</strong> with positive reviews.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Terms */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Additional Terms</h5>
                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                      <li>• You are responsible for delivering events as advertised</li>
                      <li>• Refunds may be required for cancelled or significantly changed events</li>
                      <li>• You must comply with local laws and regulations</li>
                      <li>• Eletsa reserves the right to suspend accounts for policy violations</li>
                      <li>• You agree to maintain professional communication with attendees</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="p-6 border-b border-gray-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={isUpgrading}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="text-sm">
                  <span className="text-gray-900">
                    I have read and agree to the terms and conditions above, including:
                  </span>
                  <ul className="text-gray-600 mt-1 ml-4 space-y-1">
                    <li>• The 20% platform fee on ticket sales (15% after verification)</li>
                    <li>• The delayed payment schedule until verification</li>
                    <li>• The requirement to complete 2 events for verification</li>
                    <li>• All additional terms and responsibilities</li>
                  </ul>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex space-x-3">
              <button
                onClick={closeModal}
                disabled={isUpgrading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                disabled={!acceptedTerms || isUpgrading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isUpgrading ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Upgrading Account...
                  </>
                ) : (
                  'Become an Organizer'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}