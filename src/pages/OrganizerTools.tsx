import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, BarChart3, MessageCircle, Settings, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';

export const OrganizerTools: React.FC = () => {
  const { user } = useAuth();
  const { getOrganizerByUserId } = useOrganizer();
  const navigate = useNavigate();

  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;
  const isOrganizer = !!userOrganizer;

  const handleGetStarted = () => {
    if (user && isOrganizer) {
      navigate('/my-events');
    } else if (user) {
      navigate('/profile');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-2xl mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#489707] to-[#1E30FF] bg-clip-text text-transparent mb-4">
            Organizer Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, manage, and grow successful events
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Creation</h3>
            <p className="text-gray-600 text-sm">Easy-to-use event builder with location picker, image uploads, and flexible scheduling</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendee Management</h3>
            <p className="text-gray-600 text-sm">Track registrations, manage capacity, and communicate with attendees</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Management</h3>
            <p className="text-gray-600 text-sm">Track sales, manage payouts, and view detailed financial reports</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
            <p className="text-gray-600 text-sm">Detailed analytics on ticket sales, attendee demographics, and event performance</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#489707] rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication Tools</h3>
            <p className="text-gray-600 text-sm">Built-in messaging, comment moderation, and attendee notifications</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Customization</h3>
            <p className="text-gray-600 text-sm">Flexible ticket types, pricing options, and event branding capabilities</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#489707] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Quick Setup</h4>
                  <p className="text-gray-600 text-sm">Create and publish events in minutes with our intuitive interface</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#1E30FF] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
                  <p className="text-gray-600 text-sm">Monitor ticket sales and attendee activity as it happens</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#FF2D95] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Support</h4>
                  <p className="text-gray-600 text-sm">Built-in promotion tools and social sharing features</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#f0900a] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Automated Payouts</h4>
                  <p className="text-gray-600 text-sm">Receive payments automatically after successful events</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#489707] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Community Building</h4>
                  <p className="text-gray-600 text-sm">Engage with attendees through comments, reviews, and messaging</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#1E30FF] rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                  <p className="text-gray-600 text-sm">Get help when you need it with our dedicated support team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {user && isOrganizer ? 'Manage Your Events' : 'Start Organizing Today'}
          </h2>
          <p className="text-gray-600 mb-6">
            {user && isOrganizer 
              ? 'Access your organizer dashboard and manage your events'
              : user 
                ? 'Become an organizer and start creating amazing events'
                : 'Join thousands of successful event organizers'
            }
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span>
              {user && isOrganizer ? 'Go to My Events' : user ? 'Become an Organizer' : 'Get Started'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};