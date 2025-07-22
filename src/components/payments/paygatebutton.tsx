import React from 'react';

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
    <button style={{ width: "100%", height: "55px" }} onClick={click}>
      Pay with PayGate
    </button>
  );
};

export default PayGateButton;
