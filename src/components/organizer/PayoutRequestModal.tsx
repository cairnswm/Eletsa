import React, { useState } from 'react';
import { X, DollarSign, Calendar, AlertCircle, Send } from 'lucide-react';
import { useOrganizer } from '../../contexts/OrganizerContext';
import { useEvent } from '../../contexts/EventContext';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizerId: number;
}

export const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
  organizerId,
}) => {
  const { createPayoutRequest, loading } = useOrganizer();
  const { events } = useEvent();
  const [formData, setFormData] = useState({
    event_id: '',
    requested_amount: '',
    payout_date: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Filter events for this organizer
  const organizerEvents = events.filter(event => event.organizer_id === organizerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.event_id || !formData.requested_amount) {
      setError('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.requested_amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await createPayoutRequest({
        organizer_id: organizerId,
        event_id: parseInt(formData.event_id),
        requested_amount: amount,
        status: 'pending',
        payout_date: formData.payout_date || undefined,
      });

      // Reset form and close modal
      setFormData({
        event_id: '',
        requested_amount: '',
        payout_date: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payout request');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(num);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Request Payout</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Selection */}
            <div>
              <label htmlFor="event_id" className="block text-sm font-medium text-gray-700 mb-2">
                Event *
              </label>
              <select
                id="event_id"
                name="event_id"
                value={formData.event_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent"
              >
                <option value="">Select an event</option>
                {organizerEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {organizerEvents.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">No events found for this organizer</p>
              )}
            </div>

            {/* Requested Amount */}
            <div>
              <label htmlFor="requested_amount" className="block text-sm font-medium text-gray-700 mb-2">
                Requested Amount (ZAR) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="requested_amount"
                  name="requested_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.requested_amount}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              {formData.requested_amount && (
                <p className="mt-1 text-xs text-gray-600">
                  Amount: {formatCurrency(formData.requested_amount)}
                </p>
              )}
            </div>

            {/* Preferred Payout Date */}
            <div>
              <label htmlFor="payout_date" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Payout Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="payout_date"
                  name="payout_date"
                  type="date"
                  value={formData.payout_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Optional - Leave blank for immediate processing</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.event_id || !formData.requested_amount}
                className="flex-1 bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};