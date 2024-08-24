'use client';

import { useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react'; // Import useUser from Clerk

export default function DeliveryInfo() {
  const [info, setInfo] = useState({ firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: '' });
  const [loading, setLoading] = useState(false); // Loader state
  const { user } = useUser(); // Get the current user from Clerk

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      if (!user) {
        toast.error('User is not logged in.');
        setLoading(false);
        return;
      }

      const userId = user.id; // Get the user's ID from Clerk
      const dataWithUserId = { ...info, userId }; // Include the user ID in the data

      // Save information to Firestore with user ID
      await addDoc(collection(db, 'deliveryInfo'), dataWithUserId);
      toast.success('Information saved successfully!');
      setInfo({ firstName: '', lastName: '', address: '', city: '', postalCode: '', phone: '' }); // Reset form after successful submission
    } catch (error) {
      console.error('Error saving information: ', error);
      toast.error('Failed to save information.');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="bg-white p-4 rounded-md mt-4">
      <h2 className="text-xl font-bold">Delivery Information</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            value={info.firstName} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
            required
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            value={info.lastName} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        <input 
          type="text" 
          name="address" 
          placeholder="Address" 
          value={info.address} 
          onChange={handleInputChange} 
          className="w-full p-2 border border-gray-300 rounded-md" 
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={info.city} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
            required
          />
          <input 
            type="text" 
            name="postalCode" 
            placeholder="Postal Code" 
            value={info.postalCode} 
            onChange={handleInputChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        <input 
          type="text" 
          name="phone" 
          placeholder="Phone" 
          value={info.phone} 
          onChange={handleInputChange} 
          className="w-full p-2 border border-gray-300 rounded-md" 
          required
        />
        <button 
          type="submit" 
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Saving...' : 'Save Information'}
        </button>
      </form>
    </div>
  );
}
