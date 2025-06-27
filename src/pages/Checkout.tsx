import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';
import { useEvents } from '../hooks/useEvents';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Plus, 
  Minus, 
  Trash2,
  CheckCircle,
  ShoppingCart
} from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateUtils';

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useUser();
  const { purchaseTicket } = useEvents();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = getCartTotal();

  const handlePayment = async () => {
    if (!user || cartItems.length === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process each cart item as a ticket purchase
      cartItems.forEach(item => {
        purchaseTicket(item.eventId, item.quantity, user.id);
      });

      // Clear cart and show success
      clearCart();
      setShowSuccess(true);

      // Redirect to tickets page after success
      setTimeout(() => {
        navigate('/my-tickets');
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to checkout.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some events to your cart to continue.</p>
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Discover Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your tickets have been purchased successfully.</p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Redirecting to your tickets...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Review your order and complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Event Image/Date */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.eventImage ? (
                        <img
                          src={item.eventImage}
                          alt={item.eventTitle}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-sm font-bold text-blue-600">
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
                      <h3 className="font-semibold text-gray-900 mb-2">{item.eventTitle}</h3>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(item.eventDate)} at {formatTime(item.eventDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{item.eventLocation}</span>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isProcessing}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isProcessing}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">
                            {item.price === 0 ? 'Free' : `R${item.totalPrice}`}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={isProcessing}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            {/* Order Total */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
              
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.eventTitle} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {item.price === 0 ? 'Free' : `R${item.totalPrice}`}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {total === 0 ? 'Free' : `R${total}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Secure payment processing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-3" />
                  {total === 0 ? 'Get Free Tickets' : `Pay R${total}`}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By completing your purchase, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}