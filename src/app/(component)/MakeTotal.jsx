'use client';

import { useState, useEffect } from 'react';

export default function MakeTotal({ cartItems = [], deliveryCost }) {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateSubtotal = () => {
      return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
      const subtotal = calculateSubtotal();
      const gst = subtotal * 0.08; // Assuming 8% GST
      return subtotal + gst + deliveryCost;
    };

    setSubtotal(calculateSubtotal());
    setTotal(calculateTotal());
  }, [cartItems, deliveryCost]);

  return (
    <div className="bg-white p-10 rounded-md  p-6">
      <h2 className="text-3xl font-bold mb-5">
        <span className="text-black bg-green-300 px-2">In your</span>{""}
        <span className="bg-red-500 px-2">China Box</span>
      </h2>

      <div className="bg-green-300 p-2 rounded-md">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between bg-green-300 pe-4 ps-4">
            <span>{item.name} x {item.quantity}</span>
            <span>MVR {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>MVR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>MVR {deliveryCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST 8%</span>
          <span>MVR {(subtotal * 0.08).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold mt-5">
          <span>Total</span>
          <span>MVR {total.toFixed(2)}</span>
        </div>

        <button className="bg-red-600 text-white hover:bg-red-800 font-bold py-2 px-4 rounded mt-5 w-full">
          CheckOut
        </button>
      </div>
    </div>
  );
}
