import React from 'react';
import { Ticket, Star, Clock, Calendar } from 'lucide-react';
import { useTicket } from '../contexts/useTicket';
import { TicketCard } from '../components/tickets/TicketCard';

export const Tickets: React.FC = () => {
  const { tickets, loading, error, refreshTickets } = useTicket();
  const [activeTab, setActiveTab] = React.useState<'upcoming' | 'past'>('upcoming');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  // Separate tickets into upcoming and past based on event end date
  const now = new Date();
  const upcomingTickets = tickets.filter(ticket => {
    const endDate = new Date(ticket.start_datetime); // Using start_datetime as we don't have end_datetime
    return endDate >= now;
  });
  
  const pastTickets = tickets.filter(ticket => {
    const endDate = new Date(ticket.start_datetime); // Using start_datetime as we don't have end_datetime
    return endDate < now;
  });

  const getCurrentTickets = () => {
    return activeTab === 'upcoming' ? upcomingTickets : pastTickets;
  };

  const currentTickets = getCurrentTickets();

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

        {/* Tabs */}
        {!loading && tickets.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'upcoming'
                      ? 'border-[#1E30FF] text-[#1E30FF]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Upcoming Events ({upcomingTickets.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'past'
                      ? 'border-[#1E30FF] text-[#1E30FF]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Past Events ({pastTickets.length})</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Tickets List */}
        {!loading && tickets.length > 0 ? (
          currentTickets.length > 0 ? (
            <div className="space-y-6">
              {currentTickets.map((ticket) => (
                <TicketCard 
                  key={ticket.ticket_code} 
                  ticket={ticket} 
                  showReviewOption={activeTab === 'past'}
                  isPastEvent={activeTab === 'past'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'upcoming' ? (
                  <Calendar className="w-12 h-12 text-gray-400" />
                ) : (
                  <Clock className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming events' : 'No past events'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming events. Discover new events to attend!"
                  : "You haven't attended any events yet. Your past events will appear here."
                }
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => window.location.href = '/home'}
                  className="bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Star className="w-5 h-5" />
                  <span>Discover Events</span>
                </button>
              )}
            </div>
          )
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
        {!loading && tickets.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E30FF]">
                  {tickets.length}
                </div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#489707]">
                  {upcomingTickets.length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0900a]">
                  {pastTickets.length}
                </div>
                <div className="text-sm text-gray-600">Past</div>
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