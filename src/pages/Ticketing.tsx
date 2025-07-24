import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, CreditCard, Shield, RefreshCw, QrCode, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Ticketing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/tickets');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            Ticketing Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, flexible, and user-friendly ticketing for events of all sizes
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600 text-sm">Integrated with PayGate for safe and reliable payment processing with multiple payment options</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-xl flex items-center justify-center mb-4">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Ticket Types</h3>
            <p className="text-gray-600 text-sm">Create different ticket categories with varying prices, quantities, and access levels</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF2D95] to-[#f0900a] rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Tickets</h3>
            <p className="text-gray-600 text-sm">QR code tickets for easy entry, downloadable PDFs, and mobile-friendly display</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#f0900a] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Refunds</h3>
            <p className="text-gray-600 text-sm">Configurable refund policies per ticket type with automated processing</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#489707] rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fraud Protection</h3>
            <p className="text-gray-600 text-sm">Advanced security measures to prevent ticket fraud and unauthorized access</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-[#489707] to-[#FF2D95] rounded-xl flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Management</h3>
            <p className="text-gray-600 text-sm">Download tickets as PDFs, manage purchases, and track attendance all in one place</p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Attendees</h3>
              <div className="text-3xl font-bold text-[#1E30FF] mb-2">Free</div>
              <p className="text-gray-600 mb-4">No booking fees for ticket purchases</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Secure payment processing</li>
                <li>✓ Digital ticket delivery</li>
                <li>✓ Mobile-friendly tickets</li>
                <li>✓ Customer support</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-[#1E30FF]/5 to-[#FF2D95]/5">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Organizers</h3>
              <div className="text-3xl font-bold text-[#FF2D95] mb-2">5%</div>
              <p className="text-gray-600 mb-4">Commission per ticket sold</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Unlimited events</li>
                <li>✓ Real-time analytics</li>
                <li>✓ Automated payouts</li>
                <li>✓ Marketing tools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            {user ? 'Explore your ticketing options' : 'Join thousands using our ticketing platform'}
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Ticket className="w-5 h-5 mr-2" />
            <span>{user ? 'View My Tickets' : 'Get Started Today'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};