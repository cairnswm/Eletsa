import React from 'react';
import { Ticket, Calendar, MapPin, Clock, QrCode, Download, Star } from 'lucide-react';

export const Tickets: React.FC = () => {
  // Mock ticket data - replace with actual API call
  const tickets = [
    {
      id: 1,
      event_title: 'Board Game Night',
      event_date: '2024-07-15T19:00:00Z',
      event_location: 'Community Center',
      ticket_type: 'General Admission',
      quantity: 2,
      total_paid: 50.00,
      status: 'confirmed',
      qr_code: 'QR123456789',
      purchase_date: '2024-06-20T10:30:00Z',
    },
    {
      id: 2,
      event_title: 'Photography Workshop',
      event_date: '2024-07-20T14:00:00Z',
      event_location: 'Art Studio Downtown',
      ticket_type: 'Workshop Pass',
      quantity: 1,
      total_paid: 75.00,
      status: 'confirmed',
      qr_code: 'QR987654321',
      purchase_date: '2024-06-25T15:45:00Z',
    },
    {
      id: 3,
      event_title: 'Local Food Festival',
      event_date: '2024-08-05T11:00:00Z',
      event_location: 'City Park',
      ticket_type: 'VIP Access',
      quantity: 1,
      total_paid: 120.00,
      status: 'pending',
      qr_code: 'QR456789123',
      purchase_date: '2024-07-01T09:15:00Z',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-2xl mb-6">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent mb-4">
            My Tickets
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all your event tickets in one place
          </p>
        </div>

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {ticket.event_title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-[#1E30FF]" />
                          <span>{formatDate(ticket.event_date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-[#489707]" />
                          <span>{formatTime(ticket.event_date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-[#FF2D95]" />
                          <span>{ticket.event_location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(ticket.total_paid)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ticket.ticket_type}</div>
                          <div className="text-xs text-gray-500">
                            Purchased: {formatDate(ticket.purchase_date)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {ticket.status === 'confirmed' && (
                          <>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                              <QrCode className="w-4 h-4" />
                              <span className="text-sm font-medium">Show QR</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white rounded-lg hover:opacity-90 transition-all duration-200">
                              <Download className="w-4 h-4" />
                              <span className="text-sm font-medium">Download</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section (expandable) */}
                {ticket.status === 'confirmed' && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <QrCode className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Entry Code</div>
                          <div className="text-xs text-gray-500 font-mono">{ticket.qr_code}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Show this code at the event entrance
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't purchased any tickets yet. Discover amazing events to get started!
            </p>
            <button
              onClick={() => window.location.href = '/home'}
              className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Star className="w-5 h-5" />
              <span>Discover Events</span>
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {tickets.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E30FF]">
                  {tickets.length}
                </div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#489707]">
                  {tickets.filter(t => t.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF2D95]">
                  {formatCurrency(tickets.reduce((sum, ticket) => sum + ticket.total_paid, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};