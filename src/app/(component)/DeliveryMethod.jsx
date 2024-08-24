'use client'; 

import { useState, useEffect } from 'react';
import '../globals.css'; // Import the CSS file

export default function DeliveryMethod({ onDeliverySelect }) {
  const [selectedMethod, setSelectedMethod] = useState('Male/Hulhumale');
  const [deliveryCost, setDeliveryCost] = useState(20); // Default to first method

  useEffect(() => {
    onDeliverySelect(deliveryCost);
  }, [deliveryCost, onDeliverySelect]);

  const handleDeliverySelect = (method, cost) => {
    setSelectedMethod(method);
    setDeliveryCost(cost);
  };

  return (
    <div className="bg-white p-10 rounded-md  mt-4" style={{width:"500px"}}>
      <h2 className="text-3xl font-bold mb-6">Local Delivery</h2>
      <div className="flex flex-col space-y-2">
        <label className="cursor-pointer flex items-center text-lg ms-4">
          <input
            type="radio"
            name="delivery"
            value="Male/Hulhumale"
            checked={selectedMethod === 'Male/Hulhumale'}
            onChange={() => handleDeliverySelect('Male/Hulhumale', 20)}
            className="mr-2 custom-radio"
          />
          Male/Hulhumale MVR 20
        </label>
        <label className="cursor-pointer flex items-center text-lg ms-4">
          <input
            type="radio"
            name="delivery"
            value="Atolls"
            checked={selectedMethod === 'Atolls'}
            onChange={() => handleDeliverySelect('Atolls', 45)}
            className="mr-2 custom-radio"
          />
          Atolls MVR 45
        </label>
        <label className="cursor-pointer flex items-center text-lg ms-4">
          <input
            type="radio"
            name="delivery"
            value="Pick up"
            checked={selectedMethod === 'Pick up'}
            onChange={() => handleDeliverySelect('Pick up', 0)}
            className="mr-2 custom-radio"
          />
          Pick up FREE
        </label>
      </div>
    </div>
  );
}
