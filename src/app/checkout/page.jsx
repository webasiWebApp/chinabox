'use client';

import DeliveryInfo from "../(component)/DeliveryInfo";
import PaymentMethod from "../(component)/PaymentMethod";
import { toast } from 'react-toastify';

export default function CheckOut() {

  const handleInfoSubmit = (info) => {
    toast.success('Delivery info saved successfully!');
    // Handle the delivery info as needed
  };

  const handlePaymentSelect = (method) => {
    toast.success(`Payment method selected: ${method}`);
    // Handle the payment method as needed
  };

  return (
    <div>
      <DeliveryInfo onInfoSubmit={handleInfoSubmit} />
      <PaymentMethod onPaymentSelect={handlePaymentSelect} />
    </div>
  );
}
