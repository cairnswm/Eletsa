import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Calendar, 
  MapPin,
  CreditCard,
  Trash2
} from 'lucide-react';

export function CartDropdown() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const itemCount = getCartItemCount();
  const total = getCartTotal();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-96 overflow-y-auto">
            {cartItems.length > 0 ? (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {/* Event Image/Date */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.eventImage ? (
                        <img
                          src={item.eventImage}
                          alt={item.eventTitle}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-xs font-bold text-blue-600">
                            {new Date(item.eventDate).getDate()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(item.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
                        {item.eventTitle}
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(item.eventDate)} at {formatTime(item.eventDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{item.eventLocation}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.price === 0 ? 'Free' : `R${item.totalPrice}`}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add some events to get started!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  {total === 0 ? 'Free' : `R${total}`}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}