import React from 'react';
import { Ticket, Star } from 'lucide-react';
import { useTicket } from '../contexts/useTicket';
import { TicketCard } from '../components/tickets/TicketCard';

export const Tickets: React.FC = () => {
  const { tickets, loading, error, refreshTickets } = useTicket();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
            <span className="ml-3 text-gray-600">Loading tickets...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">Error loading tickets</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => refreshTickets()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Tickets List */}
        {!loading && tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.ticket_code} ticket={ticket} />
            ))}
          </div>
        ) : !loading && (
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
                  {tickets.filter(t => t.used === 0).length}
                </div>
                <div className="text-sm text-gray-600">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF2D95]">
                  {formatCurrency(tickets.reduce((sum, ticket) => sum + (parseFloat(ticket.price) * ticket.quantity), 0))}
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