import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Ticket, Clock } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/tickets');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToTickets = () => {
    navigate('/tickets');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/5 via-white to-[#FF2D95]/5 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-[#489707] to-[#1E30FF] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#489707] to-[#1E30FF] bg-clip-text text-transparent mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-700 mb-2">
            Thank you for your payment
          </p>
          
          <p className="text-gray-600 mb-8">
            Your tickets have been confirmed and are now available in your account.
          </p>

          {/* Countdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Redirecting to your tickets in {countdown} second{countdown !== 1 ? 's' : ''}...
              </span>
            </div>
          </div>

          {/* Manual Navigation Button */}
          <button
            onClick={handleGoToTickets}
            className="w-full bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Ticket className="w-5 h-5" />
            <span>View My Tickets</span>
          </button>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};