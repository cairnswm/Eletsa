import React from 'react';
import { Search, Filter, Calendar, MapPin, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Discovery: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            Event Discovery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find amazing local events that match your interests and connect with your community
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
            <p className="text-gray-600 text-sm">Search events by keywords, location, date, or category with intelligent filtering</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location-Based</h3>
            <p className="text-gray-600 text-sm">Find events near you with interactive maps and distance filtering</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-xl flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Filters</h3>
            <p className="text-gray-600 text-sm">Filter by price range, event type, date, and popularity ratings</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Recommendations</h3>
            <p className="text-gray-600 text-sm">Get personalized event suggestions based on your interests and past attendance</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#489707] rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Calendar</h3>
            <p className="text-gray-600 text-sm">View events in calendar format and plan your schedule ahead</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trending Events</h3>
            <p className="text-gray-600 text-sm">Discover what's popular in your area and trending topics</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to discover amazing events?</h2>
          <p className="text-gray-600 mb-6">Join thousands of event enthusiasts finding their next great experience</p>
          <Link
            to="/home"
            className="inline-flex items-center bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5 mr-2" />
            <span>Start Discovering Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
};