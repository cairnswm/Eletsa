import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users, Star, Shield, Zap, CreditCard, Trophy, MessageCircle, Search } from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';

export const Landing: React.FC = () => {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const { getOrganizerByUserId } = useOrganizer();

  // Check if user is an organizer
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;
  const isOrganizer = !!userOrganizer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/10 via-white to-[#FF2D95]/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-3xl mb-6">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-6">
                {tenant?.name || 'Eletsa'}
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discover, Organize, and Experience Local Events Effortlessly
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Eletsa makes it easy for small event organizers and attendees to connect — from board game nights and trivia to workshops and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                <span>Browse Events</span>
              </Link>
              <Link
                to={user && isOrganizer ? "/my-events" : user ? "/profile" : "/register"}
                className="border-2 border-[#1E30FF] text-[#1E30FF] px-8 py-4 rounded-xl font-medium hover:bg-[#1E30FF] hover:text-white transition-all duration-200 flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Start Organizing</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#1E30FF]/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#FF2D95]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#489707]/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect event organizers and attendees
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Attendees */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Attendees</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#1E30FF] text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <p className="text-gray-700">Find events by type, location, date, or organizer</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#FF2D95] text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <p className="text-gray-700">Book and pay for tickets securely through Payweb</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#489707] text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <p className="text-gray-700">Attend, review, and share your experience</p>
                </div>
              </div>
            </div>

            {/* For Organizers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Organizers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#489707] text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                  <p className="text-gray-700">Create your organizer profile and get verified</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#1E30FF] text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                  <p className="text-gray-700">Set up your event with flexible ticketing options</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#FF2D95] text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                  <p className="text-gray-700">Manage attendees, track sales, and request payouts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover, organize, and manage events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover & Filter</h3>
              <p className="text-gray-600 text-sm">Easily search events by date, location (interactive map), type, price, and popularity.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Ticketing</h3>
              <p className="text-gray-600 text-sm">Multiple ticket types with customizable pricing and quantities.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Engagement</h3>
              <p className="text-gray-600 text-sm">Comments, reviews, private messaging, and follower notifications.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#489707] rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizer Dashboard</h3>
              <p className="text-gray-600 text-sm">Manage events, moderate comments, view analytics, and handle payouts.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Communication</h3>
              <p className="text-gray-600 text-sm">Message organizers and attendees directly to get event details and connect with your community.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">Integrated with Payweb for smooth, safe ticket purchases and payouts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Event Organizers & Attendees
            </h2>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-2">1,000+</div>
              <p className="text-gray-600">Events Hosted</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#489707] to-[#1E30FF] bg-clip-text text-transparent mb-2">10,000+</div>
              <p className="text-gray-600">Tickets Sold</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#FF2D95] to-[#f0900a] bg-clip-text text-transparent mb-2">500+</div>
              <p className="text-gray-600">Verified Organizers</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"Eletsa made organizing my monthly board game nights so much easier. The ticketing system is simple and my attendees love the community features!"</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mike Chen</h4>
                  <p className="text-sm text-gray-600">Regular Attendee</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"I've discovered so many amazing local events through Eletsa. The search filters help me find exactly what I'm looking for, and booking is always smooth."</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of local event lovers and organizers making connections every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="inline-flex items-center bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              <span>Find Your Next Event</span>
            </Link>
            {user && !isOrganizer && (
              <Link
                to="/profile"
                className="inline-flex items-center border-2 border-[#1E30FF] text-[#1E30FF] px-8 py-4 rounded-xl font-medium hover:bg-[#1E30FF] hover:text-white transition-all duration-200"
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span>Become an Organizer Today</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* About Eletsa Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            About Eletsa
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Eletsa was created to empower small event organizers and help communities thrive through easy event discovery, ticketing, and engagement. We believe that local events are the heart of vibrant communities, and our platform makes it simple for organizers to reach their audience and for attendees to discover amazing experiences right in their neighborhood.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Eletsa</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting communities through local events
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/discovery" className="hover:text-white transition-colors">Event Discovery</Link></li>
                <li><Link to="/ticketing" className="hover:text-white transition-colors">Ticketing</Link></li>
                <li><Link to="/organizer-tools" className="hover:text-white transition-colors">Organizer Tools</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/terms-privacy" className="hover:text-white transition-colors">Terms & Privacy</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs">f</span>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs">t</span>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs">in</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Eletsa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};