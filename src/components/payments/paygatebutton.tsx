import React from 'react';
import { CreditCard } from 'lucide-react';

type PayGateButtonProps = {
  createOrder: () => void;
};

const PayGateButton: React.FC<PayGateButtonProps> = ({ createOrder }) => {
  if (!createOrder) {
    throw new Error("createOrder is required.");
  }

  const click = () => {
    if (createOrder) {
      createOrder();
    }
  };

  return (
    <button 
      onClick={click}
      className="w-full bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
    >
      <CreditCard className="w-5 h-5" />
      <span>Pay with PayGate</span>
    </button>
  );
};

export default PayGateButton;
