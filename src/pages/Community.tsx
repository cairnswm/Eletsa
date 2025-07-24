import React from 'react';
import { Users, MessageCircle, Star, Trophy, UserPlus, Heart, Share2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Community: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-2xl mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF2D95] to-[#f0900a] bg-clip-text text-transparent mb-4">
            Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow event enthusiasts, organizers, and build lasting relationships
          </p>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Messaging</h3>
            <p className="text-gray-600 text-sm">Connect directly with event organizers and fellow attendees through private messaging</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-xl flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow System</h3>
            <p className="text-gray-600 text-sm">Follow your favorite organizers and get notified about their upcoming events</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
            <p className="text-gray-600 text-sm">Share your event experiences and help others discover great events</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Comments</h3>
            <p className="text-gray-600 text-sm">Engage in discussions about events with other interested attendees</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#489707] rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gamification</h3>
            <p className="text-gray-600 text-sm">Earn badges, levels, and recognition for active community participation</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Sharing</h3>
            <p className="text-gray-600 text-sm">Share events with friends and expand the community reach</p>
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Growing Community</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-2">5,000+</div>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#489707] to-[#1E30FF] bg-clip-text text-transparent mb-2">500+</div>
              <p className="text-gray-600">Verified Organizers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#FF2D95] to-[#f0900a] bg-clip-text text-transparent mb-2">15,000+</div>
              <p className="text-gray-600">Event Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#f0900a] to-[#FF2D95] bg-clip-text text-transparent mb-2">50,000+</div>
              <p className="text-gray-600">Connections Made</p>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-[#FF2D95] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Be Respectful</h4>
                  <p className="text-gray-600 text-sm">Treat all community members with kindness and respect</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-[#f0900a] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Share Authentic Reviews</h4>
                  <p className="text-gray-600 text-sm">Provide honest feedback to help others make informed decisions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-[#1E30FF] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Support Each Other</h4>
                  <p className="text-gray-600 text-sm">Help fellow community members discover great events</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-[#489707] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Content</h4>
                  <p className="text-gray-600 text-sm">Share meaningful comments and constructive feedback</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-[#FF2D95] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Engage Positively</h4>
                  <p className="text-gray-600 text-sm">Contribute to discussions in a positive and helpful manner</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-[#1E30FF] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Promote Growth</h4>
                  <p className="text-gray-600 text-sm">Help grow the community by inviting friends and sharing events</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            {user 
              ? 'Start connecting with fellow event enthusiasts today'
              : 'Create an account to join our vibrant community of event lovers'
            }
          </p>
          <Link
            to={user ? '/home' : '/register'}
            className="inline-flex items-center bg-gradient-to-r from-[#FF2D95] to-[#f0900a] text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Users className="w-5 h-5 mr-2" />
            <span>{user ? 'Explore Community' : 'Join Community'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};