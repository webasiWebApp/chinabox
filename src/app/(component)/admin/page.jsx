'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editingPriceId, setEditingPriceId] = useState(null); // State to track which product's price is being edited
  const [newPrice, setNewPrice] = useState(''); // State to store the new price being input
  const [loading, setLoading] = useState(false); // State to manage loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'productItem'));
        const productsData = [];
        for (const doc of querySnapshot.docs) {
          const productData = doc.data();
          const imageURL = await getDownloadURL(ref(storage, productData.image));
          productsData.push({ ...productData, id: doc.id, imageURL });
        }
        setProducts(productsData);
      } catch (error) {
        toast.error('Failed to fetch products!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusOptions = ['Sourcing', 'No Stock', 'Available', 'Collecting', 'Delivering', 'Delivered'];

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'productItem', id), { status });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, status } : product
        )
      );
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status!');
    } finally {
      setLoading(false);
    }
  };

  const startEditingPrice = (id, currentPrice) => {
    setEditingPriceId(id);
    setNewPrice(currentPrice || ''); // Set the current price in the input field
  };

  const handlePriceChange = (e) => {
    setNewPrice(e.target.value);
  };

  const updatePrice = async (id) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'productItem', id), { price: newPrice });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, price: newPrice } : product
        )
      );
      toast.success('Price updated successfully!');
      setEditingPriceId(null);
      setNewPrice('');
    } catch (error) {
      toast.error('Failed to update price!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="loader border-t-4 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
        </div>
      )}
      {products.map((product) => (
        <div key={product.id} className="bg-green-200 p-6 mb-6 rounded-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              {product.name}
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="ml-2">
                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500 hover:text-gray-800" />
              </a>
            </h2>
            <p>Quantity: {product.quantity}</p>
            <p>Size: {product.size}</p>
            <p>Colour: {product.colour}</p>
            <p>Additional: {product.additional}</p>
            <p>Any Additional Note: {product.note}</p>
            
            <div className="flex items-center space-x-2 mt-2">
              <p>Price: </p>
              {editingPriceId === product.id ? (
                <>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={handlePriceChange}
                    className="px-2 py-1 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => updatePrice(product.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </>
              ) : (
                <>
                  <span>{product.price ? product.price : 'N/A'}</span>
                  <button
                    onClick={() => startEditingPrice(product.id, product.price)}
                    className="px-2 py-1 text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={product.imageURL}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none">
                {product.status}
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                {statusOptions.map((status) => (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <button
                        onClick={() => updateStatus(product.id, status)}
                        className={`${
                          active ? 'bg-gray-100' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        {status}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}
