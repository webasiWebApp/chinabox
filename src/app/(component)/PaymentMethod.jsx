'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage, auth, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc ,deleteDoc, query, where, getDocs,writeBatch} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react'; // Import useUser from Clerk

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [slip, setSlip] = useState(null);
  const [slipURL, setSlipURL] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const { user } = useUser(); // Get the current user from Clerk
  const router = useRouter(); // Initialize the router

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
  };


  const handleSlipChange = (e) => {
    if (e.target.files[0]) {
      setSlip(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!slip) {
      toast.error('Please select a file to upload.');
      return;
    }
  
    setLoading(true); // Start loader
  
    try {
      if (!user) {
        toast.error('User is not logged in.');
        setLoading(false);
        return;
      }

      const userId = user.id; // Get the user's ID from Clerk
     // const dataWithUserId = { ...info, userId }; // Include the user ID in the data
  
      const slipRef = ref(storage, `paymentSlips/${uuidv4()}-${slip.name}`);
      await uploadBytes(slipRef, slip);
      const downloadURL = await getDownloadURL(slipRef);
      setSlipURL(downloadURL);
  
      // Save payment info with user ID to Firestore
      await addDoc(collection(db, 'paymentInfo'), {
        method: selectedMethod,
        slipURL: downloadURL,
        userId, // Include the user ID
      });
  
      // After successful upload, delete documents from 'chinaBoxItems' matching the userId
      const q = query(collection(db, 'chinaBoxItems'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db); // Create a batch to delete multiple documents
  
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref); // Add each document to the batch delete operation
      });
  
      await batch.commit(); // Commit the batch deletion
  
      toast.success('Slip uploaded  successfully!');

      router.push(`/chinabox`);
    } catch (error) {
      toast.error('Failed to upload slip.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <h2 className="text-xl font-bold">Payment</h2>
      <div className="flex space-x-4">
        <label className="cursor-pointer">
          <input type="radio" name="payment" value="Direct Transfer" checked={selectedMethod === 'Direct Transfer'} onChange={() => handlePaymentSelect('Direct Transfer')} />
          <span className="ml-2">Direct Transfer</span>
        </label>
      </div>
      {selectedMethod === 'Direct Transfer' && (
        <div className="mt-4 space-y-2">
          <div>
            <p className="font-bold">Bank Name: XYZ Bank</p>
            <p className="font-bold">Account Name: ABC Company</p>
            <p className="font-bold">Bank No: 123456789</p>
            <p className="font-bold">Branch: Main Branch</p>
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-medium text-gray-700">Upload Payment Slip</label>
            <input type="file" onChange={handleSlipChange} className="w-full p-2 border border-gray-300 rounded-md" />
            <button 
              onClick={handleUpload} 
              className="mt-2 bg-blue-600 text-white hover:bg-blue-800 font-bold py-2 px-4 rounded"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Uploading...' : 'Upload Slip'}
            </button>
            {slipURL && (
              <p className="mt-2 text-green-600">Slip uploaded: <a href={slipURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Slip</a></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
