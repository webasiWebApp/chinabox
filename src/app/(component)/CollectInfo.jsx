'use client';

import { useState } from 'react';
import { db, storage } from '../firebaseConfig'; // Import the Firestore and Storage instances
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '@clerk/clerk-react'; // Import useUser from Clerk
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CollectInfo() {
  const { user } = useUser(); // Get the current logged-in user
  const [formFields, setFormFields] = useState([{ url: '', name: '', quantity: '', size: '', colour: '', additional: '', note: '', image: null }]);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleFormChange = (index, event) => {
    const data = [...formFields];
    if (event.target.name === 'image') {
      data[index][event.target.name] = event.target.files[0];
    } else {
      data[index][event.target.name] = event.target.value;
    }
    setFormFields(data);
  };

  const addFields = () => {
    const newField = { url: '', name: '', quantity: '', size: '', colour: '', additional: '', note: '', image: null };
    setFormFields([...formFields, newField]);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User is not authenticated.");
      return;
    }

    setLoading(true); // Start loader
    try {
      for (let i = 0; i < formFields.length; i++) {
        const field = formFields[i];
        let imageURL = '';
        if (field.image) {
          // Upload image to Firebase Storage
          const storageRef = ref(storage, `images/${field.image.name}`);
          await uploadBytes(storageRef, field.image);
          imageURL = await getDownloadURL(storageRef);
        }

        // Save form data to Firestore
        await addDoc(collection(db, "productItem"), {
          ...field,
          image: imageURL,
          status: 'checking', // Add status field
          userId: user.id // Add current user's ID
        });
      }
      toast.success("Products submitted successfully!");
      location.reload();

    } catch (e) {
      toast.error("Error adding document.");
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-md mb-10">
        <h1 className="text-2xl font-bold mb-8">Product Information</h1>
        <form onSubmit={submit} className="space-y-4">
          {formFields.map((form, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product URL</label>
                <input type="text" name="url" value={form.url} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={form.name} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="text" name="quantity" value={form.quantity} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <input type="text" name="size" value={form.size} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Colour</label>
                  <input type="text" name="colour" value={form.colour} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional</label>
                  <input type="text" name="additional" value={form.additional} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Any Additional Note</label>
                <input type="text" name="note" value={form.note} onChange={event => handleFormChange(index, event)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input type="file" name="image" onChange={event => handleFormChange(index, event)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button type="button" onClick={addFields} className="py-2 px-4 bg-blue-500 text-white rounded-md">+ Add More Items</button>
            <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-md" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
