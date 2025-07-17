import React, { useState } from 'react';
import { User, Mail, Save, AlertCircle, CheckCircle, Users, UserCheck, Star, DollarSign, CreditCard, TrendingUp, Plus, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { FollowersList } from '../components/user/FollowersList';
import { FollowingList } from '../components/user/FollowingList';
import { PayoutRequestModal } from '../components/organizer/PayoutRequestModal';

export const Profile: React.FC = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const { 
    getOrganizerByUserId, 
    createOrganizer, 
    fetchOrganizerPayouts, 
    fetchOrganizerTransactions, 
    fetchOrganizerPayoutRequests,
    payouts, 
    transactions, 
    payoutRequests 
  } = useOrganizer();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    avatar: user?.avatar || '',
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'followers' | 'following' | 'payouts' | 'transactions'>('profile');
  const [becomingOrganizer, setBecomingOrganizer] = useState(false);
  const [showPayoutRequestModal, setShowPayoutRequestModal] = useState(false);

  // Check if user is an organizer
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;
  const isOrganizer = !!userOrganizer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  // Load organizer data when switching to organizer tabs
  React.useEffect(() => {
    if (userOrganizer && (activeTab === 'payouts' || activeTab === 'transactions')) {
      if (activeTab === 'payouts') {
        Promise.all([
          fetchOrganizerPayouts(userOrganizer.id),
          fetchOrganizerPayoutRequests(userOrganizer.id)
        ]).catch(console.error);
      } else if (activeTab === 'transactions') {
        fetchOrganizerTransactions(userOrganizer.id).catch(console.error);
      }
    }
  }, [activeTab, userOrganizer]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'processed':
      case 'success':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  // Filter data for current organizer
  const organizerPayouts = userOrganizer ? payouts.filter(p => p.organizer_id === userOrganizer.id) : [];
  const organizerTransactions = userOrganizer ? transactions.filter(t => t.organizer_id === userOrganizer.id) : [];
  const organizerPayoutRequests = userOrganizer ? payoutRequests.filter(pr => pr.organizer_id === userOrganizer.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
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
                  
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'transactions'
                        ? 'border-[#1E30FF] text-[#1E30FF]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Transactions</span>
                    </div>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <>
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 text-sm">{error}</span>
                  </div>
                )}

                {saved && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 text-sm">Profile updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                        placeholder="Enter your username"
                      />
                    </div>
                  <p className="mt-1 text-xs text-gray-500">
                    A username and/or first/last name is required to interact with other users
                  </p>
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>

                  {/* Avatar URL */}
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar URL
                    </label>
                    <input
                      id="avatar"
                      name="avatar"
                      type="url"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter a URL to your profile image</p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'followers' && (
              <FollowersList 
                userId={user.id} 
                title="Your Followers"
                showFollowButtons={true}
                className="shadow-none border-0 p-0"
              />
            )}

            {activeTab === 'following' && (
              <FollowingList 
                userId={user.id} 
                title="People You Follow"
                showFollowButtons={true}
                className="shadow-none border-0 p-0"
              />
            )}

            {activeTab === 'payouts' && isOrganizer && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-6 h-6 text-[#489707]" />
                    <h2 className="text-2xl font-bold text-gray-900">Payouts & Requests</h2>
                  </div>
                  <button
                    onClick={() => setShowPayoutRequestModal(true)}
                    className="bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Request Payout</span>
                  </button>
                </div>

                {/* Payout Requests Section */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-[#f0900a]" />
                    <h3 className="text-lg font-semibold text-gray-900">Payout Requests</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                      {organizerPayoutRequests.length}
                    </span>
                  </div>

                  {organizerPayoutRequests.length > 0 ? (
                    <div className="space-y-3">
                      {organizerPayoutRequests.map((request) => (
                        <div key={request.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {formatCurrency(request.requested_amount)}
                                </h4>
                                <p className="text-sm text-gray-600">Event ID: {request.event_id}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Requested:</span>
                              <span className="ml-2 font-medium">{formatDate(request.created_at)}</span>
                            </div>
                            {request.payout_date && (
                              <div>
                                <span className="text-gray-600">Preferred Date:</span>
                                <span className="ml-2 font-medium">{formatDate(request.payout_date)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No payout requests yet</p>
                      <p className="text-sm text-gray-500">Click "Request Payout" to create your first request</p>
                    </div>
                  )}
                </div>

                {/* Completed Payouts Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-5 h-5 text-[#489707]" />
                    <h3 className="text-lg font-semibold text-gray-900">Completed Payouts</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                      {organizerPayouts.length}
                    </span>
                  </div>

                  {organizerPayouts.length > 0 ? (
                    <div className="space-y-4">
                      {organizerPayouts.map((payout) => (
                        <div key={payout.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {formatCurrency(payout.payout_amount)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Fee: {formatCurrency(payout.payout_fee)}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.payout_status)}`}>
                              {payout.payout_status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Requested:</span>
                              <span className="ml-2 font-medium">{formatDate(payout.payout_request_date)}</span>
                            </div>
                            {payout.payout_processed_date && (
                              <div>
                                <span className="text-gray-600">Processed:</span>
                                <span className="ml-2 font-medium">{formatDate(payout.payout_processed_date)}</span>
                              </div>
                            )}
                            {payout.payout_method && (
                              <div>
                                <span className="text-gray-600">Method:</span>
                                <span className="ml-2 font-medium">{payout.payout_method}</span>
                              </div>
                            )}
                            {payout.payout_reference && (
                              <div>
                                <span className="text-gray-600">Reference:</span>
                                <span className="ml-2 font-medium font-mono text-xs">{payout.payout_reference}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed payouts yet</h3>
                      <p className="text-gray-600">Your completed payouts will appear here once processed</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && isOrganizer && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-6 h-6 text-[#1E30FF]" />
                    <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {organizerTransactions.length} total
                  </span>
                </div>

                {organizerTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {organizerTransactions.map((transaction) => (
                      <div key={transaction.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {formatCurrency(transaction.amount)} {transaction.currency}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {transaction.transaction_type}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <span className="ml-2 font-medium">{formatDate(transaction.transaction_date)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Provider:</span>
                            <span className="ml-2 font-medium">{transaction.payment_provider}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Reference:</span>
                            <span className="ml-2 font-medium font-mono text-xs">{transaction.payment_reference}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-600">Your transaction history will appear here once you start receiving payments</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {userOrganizer && (
        <PayoutRequestModal
          isOpen={showPayoutRequestModal}
          onClose={() => setShowPayoutRequestModal(false)}
          organizerId={userOrganizer.id}
        />
      )}
    </div>
  );
};