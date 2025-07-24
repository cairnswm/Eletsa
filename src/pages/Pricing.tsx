import React from 'react';
import { DollarSign, Check, Star, Users, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Pricing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-2xl mb-6">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#489707] to-[#1E30FF] bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No hidden fees, no monthly subscriptions. Pay only when you sell tickets.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Attendees */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">For Attendees</h2>
              <div className="text-5xl font-bold text-[#1E30FF] mb-2">Free</div>
              <p className="text-gray-600">No booking fees ever</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Browse unlimited events</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Secure payment processing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Digital ticket delivery</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Mobile-friendly tickets</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Community features</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Customer support</span>
              </li>
            </ul>

            <Link
              to={user ? '/home' : '/register'}
              className="w-full bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>{user ? 'Browse Events' : 'Get Started Free'}</span>
            </Link>
          </div>

          {/* Organizers */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#FF2D95] relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-[#FF2D95] to-[#f0900a] text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">For Organizers</h2>
              <div className="text-5xl font-bold text-[#FF2D95] mb-2">5%</div>
              <p className="text-gray-600">Commission per ticket sold</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Unlimited events</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Multiple ticket types</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Real-time analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Automated payouts</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Marketing tools</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#489707]" />
                <span className="text-gray-700">Priority support</span>
              </li>
            </ul>

            <Link
              to={user ? '/profile' : '/register'}
              className="w-full bg-gradient-to-r from-[#FF2D95] to-[#f0900a] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{user ? 'Become Organizer' : 'Start Organizing'}</span>
            </Link>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What's Included</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Attendees</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Organizers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Event browsing & search</td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Secure ticket purchasing</td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Digital tickets & QR codes</td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Event creation & management</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Sales analytics & reporting</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Automated payout system</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-[#489707] mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Pricing FAQ</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Are there any setup fees?</h3>
                <p className="text-gray-600 text-sm">No, there are no setup fees, monthly fees, or hidden costs. You only pay when you sell tickets.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">When do I get paid?</h3>
                <p className="text-gray-600 text-sm">You can request payouts after your events. Payments are typically processed within 3-5 business days.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What about free events?</h3>
                <p className="text-gray-600 text-sm">Free events have no commission fees. You can host unlimited free events at no cost.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Are there volume discounts?</h3>
                <p className="text-gray-600 text-sm">We offer custom pricing for high-volume organizers. Contact us to discuss your needs.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you support?</h3>
                <p className="text-gray-600 text-sm">We support all major credit cards, debit cards, and bank transfers through PayGate.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change my pricing later?</h3>
                <p className="text-gray-600 text-sm">Yes, you can update ticket prices for future events. Existing ticket sales cannot be modified.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};