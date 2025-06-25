import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useEvents } from '../contexts/EventContext';
import { useTransactions } from '../contexts/TransactionContext';
import { users as usersData } from '../data/users';
import { FollowButton } from '../components/FollowButton';
import { BecomeOrganizerModal } from '../components/BecomeOrganizerModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Edit,
  Save,
  X,
  UserCheck,
  UserPlus,
  ArrowLeftRight,
  Quote,
  Award,
  Shield,
  Settings,
  Receipt,
  Briefcase
} from 'lucide-react';

export function Profile() {
  const { 
    user, 
    updateUser, 
    getFollowers, 
    getFollowing, 
    isFollowMutual 
  } = useUser();
  const { events, getOrganizerTestimonials } = useEvents();
  const { 
    getOrganizerTransactionsWithBalance, 
    getTransactionSummary 
  } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'following' | 'followers' | 'testimonials' | 'transactions'>('profile');
  const [showBecomeOrganizerModal, setShowBecomeOrganizerModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  // Get organizer's events and transaction data
  const organizerEvents = events.filter(event => event.organizerId === user.id);
  const transactionSummary = user.role === 'organizer' ? getTransactionSummary(user.id) : null;
  const transactionsWithBalance = user.role === 'organizer' ? getOrganizerTransactionsWithBalance(user.id) : [];

  // Get followers and following
  const followers = getFollowers(user.id);
  const following = getFollowing(user.id);

  // Get testimonials for organizers
  const testimonials = user.role === 'organizer' ? getOrganizerTestimonials(user.id) : [];

  // Get event details and reviewer names for testimonials
  const testimonialsWithDetails = testimonials.map(testimonial => {
    const event = events.find(e => e.id === testimonial.eventId);
    const reviewer = usersData.find(u => u.id === testimonial.userId);
    return { ...testimonial, event, reviewer };
  }).filter(t => t.event && t.reviewer); // Only include testimonials with valid events and reviewers

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, mobileLabel: 'Profile' },
    { id: 'following', label: `Following (${following.length})`, icon: UserPlus, mobileLabel: 'Following' },
    { id: 'followers', label: `Followers (${followers.length})`, icon: UserCheck, mobileLabel: 'Followers' }
  ];

  // Add testimonials tab for organizers
  if (user.role === 'organizer') {
    tabs.push({
      id: 'testimonials',
      label: `Testimonials (${testimonials.length})`,
      icon: Quote,
      mobileLabel: 'Reviews'
    });
    
    tabs.push({
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      mobileLabel: 'Money'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and connections</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            {/* Desktop Tabs */}
            <nav className="hidden sm:flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Tabs - Icons Only */}
            <nav className="sm:hidden flex justify-around px-4 py-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center min-w-[60px] py-3 px-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{tab.mobileLabel}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{following.length} following</span>
                            <span>{followers.length} followers</span>
                            {user.role === 'organizer' && (
                              <span>{testimonials.length} testimonials</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-gray-900">{user.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                          </label>
                          <p className="text-gray-900">@{user.username}</p>
                          <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-gray-900">{user.email || 'Not provided'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                          )}
                        </div>
                      </div>

                      {/* Bio (for organizers) */}
                      {user.role === 'organizer' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          {isEditing ? (
                            <textarea
                              value={editForm.bio}
                              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Tell people about yourself and your events..."
                            />
                          ) : (
                            <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Organizer Sales Dashboard */}
                  {user.role === 'organizer' && transactionSummary && (
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales Dashboard</h2>
                      
                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="text-lg sm:text-2xl font-bold text-gray-900">R{transactionSummary.totalNetRevenue}</div>
                              <div className="text-xs sm:text-sm text-gray-600">Net Revenue</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="text-lg sm:text-2xl font-bold text-gray-900">{organizerEvents.length}</div>
                              <div className="text-xs sm:text-sm text-gray-600">Events</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 sm:p-4 border border-pink-200 col-span-2 lg:col-span-1">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="text-lg sm:text-2xl font-bold text-gray-900">R{transactionSummary.pendingBalance}</div>
                              <div className="text-xs sm:text-sm text-gray-600">Pending</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Events - Mobile Cards */}
                      <div className="block sm:hidden">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
                        <div className="space-y-3">
                          {organizerEvents.slice(0, 3).map(event => {
                            const eventTransactions = transactionsWithBalance.filter(t => t.eventId === event.id && t.type === 'sale');
                            const eventRevenue = eventTransactions.reduce((sum, t) => sum + t.netAmount, 0);
                            const isPast = new Date(event.date) < new Date();
                            
                            return (
                              <div key={event.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{event.title}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isPast ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {isPast ? 'Completed' : 'Active'}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mb-2">
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Revenue:</span>
                                  <span className="font-medium text-gray-900">R{eventRevenue}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Events Table - Desktop */}
                      <div className="hidden sm:block">
                        <div className="table-container">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Event Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Tickets Sold</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {organizerEvents.map(event => {
                                const eventTransactions = transactionsWithBalance.filter(t => t.eventId === event.id && t.type === 'sale');
                                const eventRevenue = eventTransactions.reduce((sum, t) => sum + t.netAmount, 0);
                                const isPast = new Date(event.date) < new Date();
                                
                                return (
                                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                      <div>
                                        <div className="font-medium text-gray-900">{event.title}</div>
                                        <div className="text-sm text-gray-600">
                                          {new Date(event.date).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="text-gray-900">{eventTransactions.length}</div>
                                      <div className="text-sm text-gray-600">
                                        of {event.maxParticipants} max
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="font-medium text-gray-900">R{eventRevenue}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        isPast 
                                          ? 'bg-gray-100 text-gray-800' 
                                          : event.sold >= event.maxParticipants
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {isPast ? 'Completed' : event.sold >= event.maxParticipants ? 'Sold Out' : 'Active'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          
                          {organizerEvents.length === 0 && (
                            <div className="text-center py-8">
                              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                              <p className="text-gray-600">Start organizing events to see your sales data here.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Account Credits */}
                  {user.credits !== undefined && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Credits</h3>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">R{user.credits}</div>
                        <p className="text-sm text-gray-600">Available for purchases or refunds</p>
                      </div>
                    </div>
                  )}

                  {/* Become Organizer CTA */}
                  {user.role === 'attendee' && (
                    <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl shadow-sm border border-blue-200 p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Become an Organizer</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Start creating and managing your own events. Earn revenue and build your community.
                        </p>
                        <button
                          onClick={() => setShowBecomeOrganizerModal(true)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Account Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Type</span>
                        <span className="font-medium capitalize">{user.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium">2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Following</span>
                        <span className="font-medium">{following.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Followers</span>
                        <span className="font-medium">{followers.length}</span>
                      </div>
                      {user.role === 'organizer' && transactionSummary && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Events Created</span>
                            <span className="font-medium">{organizerEvents.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="font-medium">R{transactionSummary.totalNetRevenue}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Testimonials</span>
                            <span className="font-medium">{testimonials.length}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowChangePasswordModal(true)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Change Password
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Notification Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Privacy Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Following Tab */}
            {activeTab === 'following' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">People You Follow</h2>
                {following.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {following.map((followedUser) => {
                      const isMutual = isFollowMutual(user.id, followedUser.id);
                      return (
                        <div key={followedUser.id} className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{followedUser.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">{followedUser.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isMutual && (
                                <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                  <ArrowLeftRight className="h-3 w-3 mr-1" />
                                  Mutual
                                </div>
                              )}
                            </div>
                            <FollowButton 
                              targetUserId={followedUser.id} 
                              targetUserName={followedUser.name}
                              variant="button"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Not following anyone yet</h3>
                    <p className="text-gray-600">Start following people to see their updates and connect with the community.</p>
                  </div>
                )}
              </div>
            )}

            {/* Followers Tab */}
            {activeTab === 'followers' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Followers</h2>
                {followers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followers.map((follower) => {
                      const isMutual = isFollowMutual(user.id, follower.id);
                      return (
                        <div key={follower.id} className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{follower.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">{follower.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isMutual && (
                                <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                  <ArrowLeftRight className="h-3 w-3 mr-1" />
                                  Mutual
                                </div>
                              )}
                            </div>
                            <FollowButton 
                              targetUserId={follower.id} 
                              targetUserName={follower.name}
                              variant="button"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No followers yet</h3>
                    <p className="text-gray-600">Share interesting content and engage with the community to gain followers.</p>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials Tab (for organizers only) */}
            {activeTab === 'testimonials' && user.role === 'organizer' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">My Testimonials</h2>
                  <p className="text-gray-600">
                    Reviews you've chosen to feature from your events
                  </p>
                </div>

                {testimonialsWithDetails.length > 0 ? (
                  <div className="space-y-6">
                    {testimonialsWithDetails
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((testimonial) => (
                        <div key={testimonial.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          {/* Review Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{testimonial.reviewer.name}</div>
                                <div className="text-sm text-gray-600 capitalize">{testimonial.reviewer.role}</div>
                                <div className="text-sm text-gray-500">{testimonial.date}</div>
                              </div>
                            </div>
                            
                            {/* Rating and Featured Badge */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                      star <= testimonial.rating
                                        ? 'text-amber-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 font-medium text-gray-900">
                                  {testimonial.rating}/5
                                </span>
                              </div>
                              <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                <Award className="h-4 w-4 mr-1" />
                                Featured
                              </div>
                            </div>
                          </div>

                          {/* Review Content */}
                          <blockquote className="text-gray-700 leading-relaxed mb-4 italic text-lg">
                            "{testimonial.comment}"
                          </blockquote>

                          {/* Event Reference */}
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-600">Review for:</div>
                                <div className="font-medium text-gray-900">
                                  {testimonial.event.title}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">Event Date:</div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(testimonial.event.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You haven't featured any testimonials yet. When you receive reviews on your events, you can choose to feature them as testimonials from the event details page.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab (for organizers only) */}
            {activeTab === 'transactions' && user.role === 'organizer' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction History</h2>
                  <p className="text-gray-600">
                    View your sales, payouts, and account balance
                  </p>
                </div>

                {transactionSummary && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">R{transactionSummary.totalNetRevenue}</div>
                      <div className="text-sm text-green-700">Total Earned</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">R{transactionSummary.totalPayouts}</div>
                      <div className="text-sm text-blue-700">Total Paid Out</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-600">R{transactionSummary.pendingBalance}</div>
                      <div className="text-sm text-yellow-700">Pending Balance</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">{transactionSummary.transactionCount}</div>
                      <div className="text-sm text-purple-700">Total Transactions</div>
                    </div>
                  </div>
                )}

                {transactionsWithBalance.length > 0 ? (
                  <>
                    {/* Mobile Cards */}
                    <div className="block sm:hidden space-y-4">
                      {transactionsWithBalance.map((transaction) => (
                        <div key={transaction.id} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">{transaction.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                                {new Date(transaction.timestamp).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'sale' ? 'bg-green-100 text-green-700' :
                              transaction.type === 'payout' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {transaction.type}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Amount:</span>
                              <div className={`font-medium ${
                                transaction.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.netAmount >= 0 ? '+' : ''}R{Math.abs(transaction.netAmount)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Balance:</span>
                              <div className="font-medium text-gray-900">R{transaction.balance}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block table-container">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-900">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionsWithBalance.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(transaction.timestamp).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-gray-900">{transaction.description}</div>
                                {transaction.payoutReference && (
                                  <div className="text-xs text-gray-500">Ref: {transaction.payoutReference}</div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.type === 'sale' ? 'bg-green-100 text-green-700' :
                                  transaction.type === 'payout' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {transaction.type}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-right font-medium ${
                                transaction.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.netAmount >= 0 ? '+' : ''}R{Math.abs(transaction.netAmount)}
                              </td>
                              <td className="py-3 px-4 text-right font-medium text-gray-900">
                                R{transaction.balance}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-600">Start organizing events to see your transaction history here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BecomeOrganizerModal 
        isOpen={showBecomeOrganizerModal}
        onClose={() => setShowBecomeOrganizerModal(false)}
      />
      
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}