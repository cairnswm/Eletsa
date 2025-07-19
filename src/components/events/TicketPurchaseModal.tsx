import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, AlertCircle, Users, DollarSign } from 'lucide-react';
import { TicketType } from '../../types/event';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketType: TicketType;
  eventTitle: string;
}

export const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({
  isOpen,
  onClose,
  ticketType,
  eventTitle,
}) => {
  const { user } = useAuth();
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const availableTickets = ticketType.quantity - ticketType.quantity_sold;
  const maxQuantity = Math.min(availableTickets, 10); // Limit to 10 tickets per purchase

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `R${price.toFixed(2)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const totalPrice = ticketType.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
      setError(null);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setError('You must be logged in to purchase tickets');
      return;
    }

    if (quantity < 1 || quantity > maxQuantity) {
      setError(`Please select between 1 and ${maxQuantity} tickets`);
      return;
    }

    try {
      setError(null);
      await addToCart({
        ticket_type_id: ticketType.id,
        user_id: user.id,
        price: ticketType.price,
        quantity: quantity,
      });

      // Close modal and reset state on success
      onClose();
      setQuantity(1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tickets to cart');
    }
  };

  const handleClose = () => {
    onClose();
    setQuantity(1);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Purchase Tickets</h3>
                <p className="text-sm text-gray-600">{eventTitle}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Ticket Type Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{ticketType.name}</h4>
                {ticketType.description && (
                  <p className="text-sm text-gray-600 mt-1">{ticketType.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(ticketType.price)}
                </div>
                {ticketType.price > 0 && (
                  <div className="text-xs text-gray-500">per ticket</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{availableTickets} available</span>
              </div>
              {ticketType.refundable && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Refundable
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Tickets
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center text-lg font-semibold border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent"
                />
                <span className="text-sm text-gray-600">
                  of {maxQuantity} max
                </span>
              </div>
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-[#1E30FF]" />
                <span className="font-medium text-gray-900">Total</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#1E30FF]">
                  {formatCurrency(totalPrice)}
                </div>
                {quantity > 1 && (
                  <div className="text-xs text-gray-600">
                    {formatCurrency(ticketType.price)} × {quantity}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={loading || availableTickets === 0 || quantity < 1 || quantity > maxQuantity}
              className="flex-1 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};