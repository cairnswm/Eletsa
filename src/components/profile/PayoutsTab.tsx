import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrganizer } from '../../contexts/OrganizerContext';
import { PayoutRequestModal } from '../organizer/PayoutRequestModal';

export const PayoutsTab: React.FC = () => {
  const { user } = useAuth();
  const { 
    getOrganizerByUserId,
    fetchOrganizerPayouts, 
    fetchOrganizerPayoutRequests,
    payouts, 
    payoutRequests 
  } = useOrganizer();
  const [showPayoutRequestModal, setShowPayoutRequestModal] = useState(false);

  // Get organizer data
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;

  // Load organizer data when component mounts
  useEffect(() => {
    if (userOrganizer) {
      // Only fetch if we don't already have the data
      const organizerPayouts = payouts.filter(p => p.organizer_id === userOrganizer.id);
      const organizerPayoutRequests = payoutRequests.filter(pr => pr.organizer_id === userOrganizer.id);
      
      // Only fetch if we don't have any data for this organizer
      if (organizerPayouts.length === 0 && organizerPayoutRequests.length === 0) {
        Promise.all([
          fetchOrganizerPayouts(userOrganizer.id),
          fetchOrganizerPayoutRequests(userOrganizer.id)
        ]).catch(console.error);
      }
    }
  }, [userOrganizer?.id, payouts, payoutRequests, fetchOrganizerPayouts, fetchOrganizerPayoutRequests]);

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

  if (!user || !userOrganizer) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizer Access Required</h3>
        <p className="text-gray-600">You need to be an event organizer to access payouts</p>
      </div>
    );
  }

  // Filter data for current organizer
  const organizerPayouts = payouts.filter(p => p.organizer_id === userOrganizer.id);
  const organizerPayoutRequests = payoutRequests.filter(pr => pr.organizer_id === userOrganizer.id);

  return (
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
                  <div>
                    <span className="text-gray-600">Preferred Date:</span>
                    <span className="ml-2 font-medium">
                      {request.payout_date ? formatDate(request.payout_date) : 'Immediate'}
                    </span>
                  </div>
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

      {/* Payout Request Modal */}
      <PayoutRequestModal
        isOpen={showPayoutRequestModal}
        onClose={() => setShowPayoutRequestModal(false)}
        organizerId={userOrganizer.id}
      />
    </div>
  );
};