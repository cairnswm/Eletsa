import React from "react";
import PayGateButton from "./paygatebutton";
import { useTenant } from "../../contexts/TenantContext";
import { useAuth } from "../../contexts/AuthContext";

const PAYWEB3_API = "https://eletsa.cairns.co.za/php/payment";

type PayGateProps = {
  onGetOrder: () => Promise<{ id: string; total_price: number }>;
  onPaid: () => void;
};

const PayGate: React.FC<PayGateProps> = ({ onGetOrder, onPaid }) => {
  if (!onGetOrder) {
    throw new Error("onGetOrder is required.");
  }
  if (!onPaid) {
    throw new Error("onPaid is required.");
  }

  const { tenant } = useTenant();
  const { user, token } = useAuth();

  const submitPayment = (payment_id: string, checksum: string) => {
    const form = document.createElement("form");
    form.action = "https://secure.paygate.co.za/payweb3/process.trans";
    form.method = "POST";

    const input1 = document.createElement("input");
    input1.type = "hidden";
    input1.name = "PAY_REQUEST_ID";
    input1.value = payment_id;
    form.appendChild(input1);

    const input2 = document.createElement("input");
    input2.type = "hidden";
    input2.name = "CHECKSUM";
    input2.value = checksum;
    form.appendChild(input2);

    document.body.appendChild(form);
    form.submit();
  };

  const createOrder = async () => {
    try {
      const order = await onGetOrder();
      const orderId = order.id;
      const response = await fetch(
        `${PAYWEB3_API}/initiate.php?order_id=${orderId}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            App_id: tenant?.uuid ? tenant.uuid : "",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();
      const { payment_id, checksum } = result;

      submitPayment(payment_id, checksum);

      return checksum;
    } catch (error) {
      console.error("Error creating PAYGATE order:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div>
      <PayGateButton createOrder={createOrder} />
    </div>
  );
};

export default PayGate;
