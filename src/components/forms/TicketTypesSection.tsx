import React from 'react';
import { DollarSign, Plus, Trash2, RefreshCw, Gift } from 'lucide-react';

interface TicketTypeForm {
  id: string | number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  refundable: boolean;
  isNew?: boolean;
}

interface TicketTypesSectionProps {
  ticketTypes: TicketTypeForm[];
  isFreeEvent?: boolean;
  onFreeEventChange?: (isFree: boolean) => void;
  onTicketTypeChange: (id: string | number, field: keyof TicketTypeForm, value: string | number | boolean) => void;
  onAddTicketType: () => void;
  onRemoveTicketType: (id: string | number) => void;
}

export const TicketTypesSection: React.FC<TicketTypesSectionProps> = ({
  ticketTypes,
  isFreeEvent = false,
  onFreeEventChange,
  onTicketTypeChange,
  onAddTicketType,
  onRemoveTicketType,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  // Check if all ticket types have price 0
  const allTicketsAreFree = ticketTypes.every(ticket => ticket.price === 0);
  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-[#f0900a]" />
          <span>Ticket Types</span>
        </h2>
        <button
          type="button"
          onClick={onAddTicketType}
          className="bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ticket Type</span>
        </button>
      </div>

      {/* Warning message when all ticket types are free */}
      {allTicketsAreFree && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">
            If no ticket types are entered the event will be free entry.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {ticketTypes.map((ticket, index) => (
          <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ticket Type {index + 1}
                {ticket.isNew && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>}
              </h3>
              {ticketTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveTicketType(ticket.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Ticket Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Name *
                </label>
                <input
                  type="text"
                  required
                  value={ticket.name}
                  onChange={(e) => onTicketTypeChange(ticket.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="e.g., General Admission, VIP, Early Bird"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (ZAR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400">R</span>
                  <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={ticket.price === 0 ? '' : ticket.price}
                  onChange={(e) => {
                    let value = e.target.value.replace(/^0+(?=\d)/, '');
                    onTicketTypeChange(ticket.id, 'price', parseFloat(value) || 0);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  />
                </div>
                {ticket.price > 0 && (
                  <p className="mt-1 text-xs text-gray-600">
                    Price: {formatCurrency(ticket.price)}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={ticket.quantity}
                  onChange={(e) => onTicketTypeChange(ticket.id, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="50"
                />
              </div>

              {/* Refundable */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`refundable-${ticket.id}`}
                  checked={ticket.refundable}
                  onChange={(e) => onTicketTypeChange(ticket.id, 'refundable', e.target.checked)}
                  className="w-4 h-4 text-[#1E30FF] border-gray-300 rounded focus:ring-[#1E30FF]"
                />
                <label htmlFor={`refundable-${ticket.id}`} className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refundable</span>
                </label>
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={ticket.description}
                  onChange={(e) => onTicketTypeChange(ticket.id, 'description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Optional description for this ticket type"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free event checkbox when all ticket types are free */}
      {allTicketsAreFree && onFreeEventChange !== undefined && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="free-event"
              checked={isFreeEvent}
              onChange={(e) => onFreeEventChange(e.target.checked)}
              className="w-4 h-4 text-[#1E30FF] border-gray-300 rounded focus:ring-[#1E30FF]"
            />
            <label htmlFor="free-event" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Gift className="w-4 h-4 text-[#489707]" />
              <span>This event is free</span>
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500 ml-7">
            Check this box to confirm that this event has free admission
          </p>
        </div>
      )}
    </div>
  );
};