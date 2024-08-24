'use client';

import { useState, useEffect } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function MakeTotal({ cartItems = [], deliveryCost, onItemRemoved }) {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null); // Track the item to be deleted
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Track the visibility of the popup

  useEffect(() => {
    const calculateSubtotal = () => {
      return cartItems.reduce((acc, item) => acc + item.data.price * item.data.quantity, 0);
    };

    const calculateTotal = () => {
      const subtotal = calculateSubtotal();
      const gst = subtotal * 0.08; // Assuming 8% GST
      return subtotal + gst + deliveryCost;
    };

    setSubtotal(calculateSubtotal());
    setTotal(calculateTotal());
  }, [cartItems, deliveryCost]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsPopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        // Delete from Firebase
       // console.log(itemToDelete.id);
        await deleteDoc(doc(db, 'chinaBoxItems', itemToDelete.id));

        // Call the onItemRemoved callback to remove the item from the local state
       // onItemRemoved(itemToDelete.id);

        setIsPopupOpen(false);
        setItemToDelete(null);

        window.location.reload()
      } catch (error) {
        console.error("Error deleting item: ", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsPopupOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="bg-white p-10 rounded-md p-6">
      <h2 className="text-3xl font-bold mb-5">
        <span className="text-black bg-green-300 px-2">In your</span>{""}
        <span className="bg-red-500 px-2">China Box</span>
      </h2>

      <div className="bg-green-300 p-2 rounded-md">
        {cartItems.map((item,index) => (
          <div key={`${item.id}-${index}`} className="flex justify-between bg-green-300 pe-4 ps-4 items-center">
            <div className="flex items-center">
              <span>{item.data.name} x {item.data.quantity}</span>
            </div>
            <div className="flex items-center">
              <span>MVR {item.data.price * item.data.quantity}</span>
              <button
                onClick={() => handleDeleteClick(item)}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
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

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="mb-4">Do you really want to remove {itemToDelete?.name} from your cart?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
