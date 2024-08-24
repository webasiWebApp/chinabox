'use client';

import { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function DeliveryInfo({ onInfoSubmit }) {
  const [info, setInfo] = useState({ firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save information to Firestore
      await addDoc(collection(db, 'deliveryInfo'), info);
      toast.success('Information saved successfully!');

      // Optionally, call the onInfoSubmit callback if you need to do something else with the info
      if (onInfoSubmit) {
        onInfoSubmit(info);
      }
    } catch (error) {
      console.error('Error saving information: ', error);
      toast.error('Failed to save information.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-md mt-4">
      <h2 className="text-xl font-bold">Delivery Information</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First Name" value={info.firstName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="text" name="lastName" placeholder="Last Name" value={info.lastName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <input type="text" name="address" placeholder="Address" value={info.address} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="city" placeholder="City" value={info.city} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="text" name="postalCode" placeholder="Postal Code" value={info.postalCode} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <input type="text" name="phone" placeholder="Phone" value={info.phone} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Information</button>
      </form>
    </div>
  );
}
