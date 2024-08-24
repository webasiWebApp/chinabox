'use client'; 

import { useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

export default function PaymentMethod({ onPaymentSelect }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [slip, setSlip] = useState(null);
  const [slipURL, setSlipURL] = useState('');

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
    onPaymentSelect(method);
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

    const slipRef = ref(storage, `paymentSlips/${uuidv4()}-${slip.name}`);
    try {
      await uploadBytes(slipRef, slip);
      const downloadURL = await getDownloadURL(slipRef);
      setSlipURL(downloadURL);
      toast.success('Slip uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload slip.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <h2 className="text-xl font-bold">Payment</h2>
      <div className="flex space-x-4">
        {/* <label className="cursor-pointer">
          <input type="radio" name="payment" value="Credit Card" checked={selectedMethod === 'Credit Card'} onChange={() => handlePaymentSelect('Credit Card')} />
          <span className="ml-2">Credit Card</span>
        </label> */}
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
            <button onClick={handleUpload} className="mt-2 bg-blue-600 text-white hover:bg-blue-800 font-bold py-2 px-4 rounded">
              Upload Slip
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
