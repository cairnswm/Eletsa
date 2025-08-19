import React, { useState } from 'react';
import { User, Users, UserCheck, Star, DollarSign, TrendingUp, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { TransactionProvider, useTransaction } from '../contexts/TransactionContext';
import { ProfileTab } from '../components/profile/ProfileTab';
import { FollowersTab } from '../components/profile/FollowersTab';
import { FollowingTab } from '../components/profile/FollowingTab';
import { OrganizerTab } from '../components/profile/OrganizerTab';
import { PayoutsTab } from '../components/profile/PayoutsTab';
import { TransactionsTab } from '../components/profile/TransactionsTab';

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  const { getOrganizerByUserId, createOrganizer } = useOrganizer();
  const [activeTab, setActiveTab] = useState<'profile' | 'followers' | 'following' | 'payouts' | 'transactions'>('profile');
  const [activeTab, setActiveTab] = useState<'profile' | 'followers' | 'following' | 'organizer' | 'payouts' | 'transactions'>('profile');
  const [becomingOrganizer, setBecomingOrganizer] = useState(false);

  // Check if user is an organizer
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;
  const isOrganizer = !!userOrganizer;

  const handleBecomeOrganizer = async () => {
    if (!user || becomingOrganizer) return;

    try {
      setBecomingOrganizer(true);
      await createOrganizer({
        user_id: user.id,
        is_verified: false,
        payout_eligible: false,
        events_hosted: 0,
        tickets_sold: 0,
        positive_reviews: 0,
        quick_payout_eligibility: false,
      });
    } catch (err) {
      console.error('Failed to become organizer:', err);
    } finally {
      setBecomingOrganizer(false);
    }
  };


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/80">Manage your account information</p>
                {isOrganizer && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-white/90 text-sm font-medium">Event Organizer</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Become Organizer Bar */}
          {!isOrganizer && (
            <div className="bg-gradient-to-r from-[#489707]/10 to-[#1E30FF]/10 border-b border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Become an Event Organizer</h3>
                    <p className="text-sm text-gray-600">Start hosting your own events and build your community</p>
                  </div>
                </div>
                <button
                  onClick={handleBecomeOrganizer}
                  disabled={becomingOrganizer}
                  className="bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{becomingOrganizer ? 'Setting up...' : 'Get Started'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('followers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'followers'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Followers</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('following')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'following'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Following</span>
                </div>
              </button>

              {/* Organizer-only tabs */}
              {isOrganizer && (
                <>
                  <button
                    onClick={() => setActiveTab('organizer')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'organizer'
                        ? 'border-[#1E30FF] text-[#1E30FF]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Organizer</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('payouts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'payouts'
                        ? 'border-[#1E30FF] text-[#1E30FF]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Payouts</span>
                    </div>
                  </button>
                </>
              )}
              
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'transactions'
                    ? 'border-[#1E30FF] text-[#1E30FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4" />
                  <span>Transactions</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'followers' && <FollowersTab />}
            {activeTab === 'following' && <FollowingTab />}
            {activeTab === 'organizer' && isOrganizer && <OrganizerTab />}
            {activeTab === 'organizer' && isOrganizer && <OrganizerTab />}
            {activeTab === 'payouts' && isOrganizer && <PayoutsTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Profile: React.FC = () => {
  return (
    <TransactionProvider>
      <ProfileContent />
    </TransactionProvider>
  );
};