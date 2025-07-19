import React from 'react';
import { CreditCard, Users, RefreshCw } from 'lucide-react';
import { TicketType } from '../../types/event';

interface TicketTypeCardProps {
  ticketType: TicketType;
  onBuyTickets: (ticketType: TicketType) => void;
  eventTitle: string;
}

export const TicketTypeCard: React.FC<TicketTypeCardProps> = ({ 
  ticketType, 
  onBuyTickets, 
  eventTitle 
}) => {
  const availableTickets = ticketType.quantity - ticketType.quantity_sold;
  const isAvailable = availableTickets > 0;

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `R${price.toFixed(2)}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-[#1E30FF] transition-colors duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticketType.name}</h3>
          {ticketType.description && (
            <p className="text-gray-600 text-sm mb-3">{ticketType.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{availableTickets} of {ticketType.quantity} available</span>
            </div>
            
            {ticketType.refundable && (
              <div className="flex items-center space-x-1">
                <RefreshCw className="w-4 h-4" />
                <span>Refundable</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right ml-6">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatPrice(ticketType.price)}
          </div>
          
          <button
            onClick={() => onBuyTickets(ticketType)}
            disabled={!isAvailable}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isAvailable
                ? 'bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white hover:opacity-90 shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isAvailable ? 'Buy Tickets' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
      
      {!isAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
          <p className="text-red-600 text-sm font-medium">
            This ticket type is currently sold out.
          </p>
        </div>
      )}
    </div>
  );
};