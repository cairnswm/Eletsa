import React, { useState } from 'react';
import { Calendar, MapPin, Clock, QrCode, Download, Trash2 } from 'lucide-react';
import { UserTicket } from '../../types/ticket';
import { LocationViewModal } from './LocationViewModal';
import { LocationShare } from './LocationShare';

interface TicketCardProps {
  ticket: UserTicket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

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

  const getStatusColor = (used: number) => {
    return used === 0 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (used: number) => {
    return used === 0 ? 'Valid' : 'Used';
  };

  // Check if location coordinates are available
  const hasLocation = ticket.location_latitude && ticket.location_longitude && 
                     ticket.location_latitude !== '0' && ticket.location_longitude !== '0';

  const latitude = hasLocation ? parseFloat(ticket.location_latitude) : 0;
  const longitude = hasLocation ? parseFloat(ticket.location_longitude) : 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {ticket.event_title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-[#1E30FF]" />
                  <span>{formatDate(ticket.start_datetime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-[#489707]" />
                  <span>{formatTime(ticket.start_datetime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-[#FF2D95]" />
                  <span>{ticket.location_name}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right ml-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(ticket.used)}`}>
                {getStatusText(ticket.used)}
              </span>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(parseFloat(ticket.price))}
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
                    Assigned: {formatDate(ticket.assigned_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Location Button - only show if coordinates exist */}
                {hasLocation && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setShowLocationModal(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">View Location</span>
                    </button>
                    <LocationShare 
                      latitude={latitude} 
                      longitude={longitude}
                      locationName={ticket.location_name}
                    />
                  </div>
                )}

                {ticket.used === 0 && (
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
        {ticket.used === 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <QrCode className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Entry Code</div>
                  <div className="text-xs text-gray-500 font-mono">{ticket.ticket_code}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Show this code at the event entrance
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location View Modal */}
      {hasLocation && (
        <LocationViewModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          latitude={latitude}
          longitude={longitude}
          locationName={ticket.location_name}
          eventTitle={ticket.event_title}
        />
      )}
    </>
  );
};