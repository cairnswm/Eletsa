import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useEvents } from '../contexts/EventContext';
import { users as usersData } from '../data/users';
import { FollowButton } from '../components/FollowButton';
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
  ShieldCheck,
  Percent,
  Clock,
  BarChart3,
  Eye,
  MapPin
} from 'lucide-react';

export function Profile() {
  const { 
    user, 
    updateUser, 
    getFollowers, 
    getFollowing, 
    isFollowMutual,
    calculateNetRevenue,
    getPlatformFee,
    checkVerificationStatus
  } = useUser();
  const { events, tickets, getOrganizerTestimonials, getOrganizerCompletedEvents } = useEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'following' | 'followers' | 'testimonials' | 'sales'>('profile');
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

  // Get organizer's events and sales data
  const organizerEvents = events.filter(event => event.organizerId === user.id);
  const completedEvents = getOrganizerCompletedEvents(user.id);
  const organizerTickets = tickets.filter(ticket => 
    organizerEvents.some(event => event.id === ticket.eventId)
  );

  const totalGrossRevenue = organizerTickets.reduce((sum, ticket) => sum + ticket.price, 0);
  const totalNetRevenue = calculateNetRevenue(totalGrossRevenue, user.id);
  const totalPlatformFee = getPlatformFee(totalGrossRevenue, user.id);
  const totalTicketsSold = organizerTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

  // Calculate monthly earnings (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTickets = organizerTickets.filter(ticket => {
    const ticketDate = new Date(ticket.purchaseDate);
    return ticketDate.getMonth() === currentMonth && ticketDate.getFullYear() === currentYear;
  });
  const monthlyGrossEarnings = monthlyTickets.reduce((sum, ticket) => sum + ticket.price, 0);
  const monthlyNetEarnings = calculateNetRevenue(monthlyGrossEarnings, user.id);

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

  // Check if organizer is eligible for verification
  const isEligibleForVerification = user.role === 'organizer' && completedEvents.length >= 2;
  const isVerified = checkVerificationStatus(user.id);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'following', label: `Following (${following.length})`, icon: UserPlus },
    { id: 'followers', label: `Followers (${followers.length})`, icon: UserCheck }
  ];

  // Add sales tab for organizers
  if (user.role === 'organizer') {
    tabs.push({
      id: 'sales',
      label: 'Sales',
      icon: BarChart3
    });
  }

  // Add testimonials tab for organizers
  if (user.role === 'organizer') {
    tabs.push({
      id: 'testimonials',
      label: `Testimonials (${testimonials.length})`,
      icon: Quote
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
            <nav className="flex space-x-8 px-6">
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
          </div>

          <div className="p-6">
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
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                            {isVerified && (
                              <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Verified
                              </div>
                            )}
                            {!isVerified && user.role === 'organizer' && (
                              <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Unverified
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{following.length} following</span>
                            <span>{followers.length} followers</span>
                            {user.role === 'organizer' && (
                              <>
                                <span>{testimonials.length} testimonials</span>
                                <span>{completedEvents.length} completed events</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Verification Status for Organizers */}
                      {user.role === 'organizer' && (
                        <div className={`p-4 rounded-lg border ${
                          isVerified 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {isVerified ? (
                              <ShieldCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <Shield className="h-5 w-5 text-yellow-600" />
                            )}
                            <div>
                              <h4 className={`font-medium ${
                                isVerified ? 'text-green-900' : 'text-yellow-900'
                              }`}>
                                {isVerified ? 'Verified Organizer' : 'Verification Status'}
                              </h4>
                              <p className={`text-sm ${
                                isVerified ? 'text-green-700' : 'text-yellow-700'
                              }`}>
                                {isVerified 
                                  ? 'You are a verified organizer with faster payouts and enhanced credibility.'
                                  : `Complete ${2 - completedEvents.length} more event${2 - completedEvents.length !== 1 ? 's' : ''} to become verified and get faster payouts.`
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

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

                  {/* Revenue Breakdown for Organizers (Current Month Only) */}
                  {user.role === 'organizer' && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">This Month's Revenue</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="text-xl font-bold text-gray-900">R{monthlyGrossEarnings}</div>
                              <div className="text-sm text-gray-600">Gross Revenue</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                              <Percent className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="text-xl font-bold text-red-600">-R{getPlatformFee(monthlyGrossEarnings, user.id)}</div>
                              <div className="text-sm text-gray-600">Platform Fee ({user.fee}%)</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="text-xl font-bold text-green-600">R{monthlyNetEarnings}</div>
                              <div className="text-sm text-gray-600">Net Revenue</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setActiveTab('sales')}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Detailed Sales Report
                        </button>
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

                  {/* Platform Fee Info for Organizers */}
                  {user.role === 'organizer' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Fee</h3>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Percent className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">{user.fee}%</div>
                        <p className="text-sm text-gray-600 mb-4">Platform fee on all sales</p>
                        
                        {/* Payout Schedule */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Payout Schedule</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {isVerified 
                              ? 'Verified: 3-5 business days'
                              : 'Unverified: 7-10 business days'
                            }
                          </p>
                        </div>
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
                        <span className="text-gray-600">Verification Status</span>
                        <div className="flex items-center space-x-1">
                          {isVerified ? (
                            <>
                              <ShieldCheck className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-600">Verified</span>
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 text-yellow-600" />
                              <span className="font-medium text-yellow-600">Unverified</span>
                            </>
                          )}
                        </div>
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
                      {user.role === 'organizer' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Events Created</span>
                            <span className="font-medium">{organizerEvents.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Net Revenue</span>
                            <span className="font-medium">R{totalNetRevenue}</span>
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
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Change Password
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Notification Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Privacy Settings
                      </button>
                      {user.role === 'organizer' && (
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          Payout Settings
                        </button>
                      )}
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Tab (Organizers Only) */}
            {activeTab === 'sales' && user.role === 'organizer' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Sales Dashboard</h2>
                  <p className="text-gray-600">Detailed breakdown of your event sales and revenue</p>
                </div>

                {/* Revenue Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-2xl font-bold text-gray-900">R{totalGrossRevenue}</div>
                        <div className="text-sm text-gray-600">Total Gross Revenue</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <Percent className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-2xl font-bold text-red-600">R{totalPlatformFee}</div>
                        <div className="text-sm text-gray-600">Platform Fees</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-2xl font-bold text-green-600">R{totalNetRevenue}</div>
                        <div className="text-sm text-gray-600">Net Revenue</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-2xl font-bold text-gray-900">{totalTicketsSold}</div>
                        <div className="text-sm text-gray-600">Tickets Sold</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Event Performance</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Event</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Tickets Sold</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Gross Revenue</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Platform Fee</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Net Revenue</th>
                          <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {organizerEvents.map(event => {
                          const eventTickets = organizerTickets.filter(ticket => ticket.eventId === event.id);
                          const eventGrossRevenue = eventTickets.reduce((sum, ticket) => sum + ticket.price, 0);
                          const eventPlatformFee = getPlatformFee(eventGrossRevenue, user.id);
                          const eventNetRevenue = calculateNetRevenue(eventGrossRevenue, user.id);
                          const eventTicketsSold = eventTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
                          const isPast = new Date(event.date) < new Date();
                          
                          return (
                            <tr key={event.id} className="hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div>
                                  <div className="font-medium text-gray-900">{event.title}</div>
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm text-gray-900">
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-gray-900">{eventTicketsSold}</div>
                                <div className="text-sm text-gray-600">
                                  of {event.maxParticipants} max
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-gray-900">R{eventGrossRevenue}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-red-600">R{eventPlatformFee}</div>
                                <div className="text-xs text-gray-500">{user.fee}%</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-medium text-green-600">R{eventNetRevenue}</div>
                              </td>
                              <td className="py-4 px-6">
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
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                        <p className="text-gray-600">Start organizing events to see your sales data here.</p>
                      </div>
                    )}
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
          </div>
        </div>
      </div>
    </div>
  );
}