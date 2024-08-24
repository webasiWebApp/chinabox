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
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const statusOptions = ['Sourcing', 'No Stock', 'Available', 'Collecting', 'Delivering', 'Delivered'];
  const paymentStatusOptions = ['Checking', 'Decline', 'Accept'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Products
        const productSnapshot = await getDocs(collection(db, 'productItem'));
        const productData = [];
        for (const doc of productSnapshot.docs) {
          const product = doc.data();
          const imageURL = await getDownloadURL(ref(storage, product.image));
          productData.push({
            id: doc.id,
            ...product,
            imageURL,
          });
        }
        setProducts(productData);

        // Fetch Purchases
        const purchaseSnapshot = await getDocs(collection(db, 'purchases'));
        const purchaseData = [];
        for (const doc of purchaseSnapshot.docs) {
          const purchase = doc.data();
          const deliveryInfo = await getDocs(collection(db, `deliveryInfo/${purchase.userId}/info`));
          purchaseData.push({
            id: doc.id,
            ...purchase,
            deliveryInfo: deliveryInfo.docs.map(infoDoc => infoDoc.data())[0], // Assume one delivery info per purchase
          });
        }
        setPurchases(purchaseData);

        toast.success('Data loaded successfully!');
      } catch (error) {
        toast.error('Failed to fetch data!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id, status, collectionName) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, collectionName, id), { status });
      toast.success('Status updated successfully!');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to update status!');
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

      {/* Product Management Section */}
      <h2 className="text-2xl font-bold mb-5">Product Management</h2>
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
                        onClick={() => updateStatus(product.id, status, 'productItem')}
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

      {/* Purchase Management Section */}
      <h2 className="text-2xl font-bold mb-5">Purchase Management</h2>
      {purchases.map((purchase) => (
        <div key={purchase.id} className="bg-blue-200 p-6 mb-6 rounded-md">
          <div>
            <h2 className="text-xl font-bold">User ID: {purchase.userId}</h2>
            <p>Payment Method: {purchase.method}</p>
            <p>Total Amount: MVR {purchase.totalPrice}</p>
            <p>Status: {purchase.status}</p>
            <p>Delivery Info:</p>
            <p>{purchase.deliveryInfo?.address}, {purchase.deliveryInfo?.city}, {purchase.deliveryInfo?.postalCode}</p>
          </div>
          <div className="flex flex-col items-end">
            {purchase.slipURL && (
              <a href={purchase.slipURL} target="_blank" rel="noopener noreferrer">
                <img src={purchase.slipURL} alt="Payment Slip" className="w-24 h-24 object-cover mb-4" />
              </a>
            )}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none">
                {purchase.status}
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                {paymentStatusOptions.map((status) => (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <button
                        onClick={() => updateStatus(purchase.id, status, 'purchases')}
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
