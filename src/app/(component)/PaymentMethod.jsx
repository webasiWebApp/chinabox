'use client'; 

import { useState } from 'react';

export default function PaymentMethod({ onPaymentSelect }) {
  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
    onPaymentSelect(method);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <h2 className="text-xl font-bold">Payment</h2>
      <div className="flex space-x-4">
        <label className="cursor-pointer">
          <input type="radio" name="payment" value="Credit Card" checked={selectedMethod === 'Credit Card'} onChange={() => handlePaymentSelect('Credit Card')} />
          <span className="ml-2">Credit Card</span>
        </label>
        <label className="cursor-pointer">
          <input type="radio" name="payment" value="Direct Transfer" checked={selectedMethod === 'Direct Transfer'} onChange={() => handlePaymentSelect('Direct Transfer')} />
          <span className="ml-2">Direct Transfer</span>
        </label>
      </div>
      {selectedMethod === 'Credit Card' && (
        <div className="mt-4 space-y-2">
          <input type="text" placeholder="Card Number" className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="text" placeholder="Expiration (MM/YY)" className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="text" placeholder="Security Code (CVV)" className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="text" placeholder="Name on Card" className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
      )}
    </div>
  );
}
