'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductList({ onProductAdded, onProductRemoved }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]); // Track added products
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formFields, setFormFields] = useState([{ url: '', name: '', quantity: '', size: '', colour: '', additional: '', note: '', image: null }]);
  const [loadingProductId, setLoadingProductId] = useState(null); // Track the product ID for loading status

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

        const addedProductsSnapshot = await getDocs(collection(db, 'chinaBoxItems'));
        const addedProductsData = addedProductsSnapshot.docs.map(doc => doc.id);
        setAddedProducts(addedProductsData);

        toast.success('Products loaded successfully!');
      } catch (error) {
        console.log(error);
        toast.error('Failed to load products!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (product) => {
    if (product.status === 'Sourcing' || product.status === 'No Stock') {
      setEditingProduct(product);
      setFormFields([{ ...product, image: null }]);
      setIsPopupOpen(true);
    }
  };

  const handleFormChange = (index, event) => {
    const data = [...formFields];
    if (event.target.name === 'image') {
      data[index][event.target.name] = event.target.files[0];
    } else {
      data[index][event.target.name] = event.target.value;
    }
    setFormFields(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const field = formFields[0];
      let imageURL = editingProduct.imageURL;

      if (field.image) {
        const storageRef = ref(storage, `images/${field.image.name}`);
        await uploadBytes(storageRef, field.image);
        imageURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'productItem', editingProduct.id), {
        ...field,
        image: imageURL,
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? { ...field, id: product.id, imageURL } : product
        )
      );

      toast.success('Product updated successfully!');
      setIsPopupOpen(false);
    } catch (error) {
      toast.error('Failed to update product!');
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailableClick = async (product) => {
    if (product.price === undefined || product.price === null) {
      toast.error("Product price is missing. Please add a price before adding the product.");
      return;
    }

    setLoadingProductId(product.id); // Set the loading state for the specific product
  
    try {
      const docRef = await addDoc(collection(db, 'chinaBoxItems'), {
        ...product,
        status: 'Added to Box',
      });

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.id === product.id ? { ...item, status: 'Added to Box' } : item
        )
      );

      setAddedProducts((prevAdded) => [...prevAdded, product.id]);

      toast.success("Product added to China Box successfully!");
      window.location.reload();

    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error("Failed to add product to China Box.");
    } finally {
      setLoadingProductId(null); // Clear the loading state
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'productItem', id));
      await deleteDoc(doc(db, 'chinaBoxItems', id));  // Assuming the document ID is the same for simplicity

      setProducts(products.filter(product => product.id !== id));
      setAddedProducts(addedProducts.filter(addedId => addedId !== id));
      onProductRemoved(id);
      toast.info('Product removed!');
    } catch (error) {
      toast.error('Failed to remove product!');
      console.error("Error removing document: ", error);
    }
  };

  return (
    <div className="space-y-4 p-10 m-10">
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="loader border-t-4 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
        </div>
      )}
      {products.map((product) => (
        <div
          key={product.id}
          className={`flex items-center justify-between p-8 rounded-md ${
            product.status === 'Available' ? 'bg-[#A4F2DE]' :
            product.status === 'No Stock' ? 'bg-red-500' :
            product.status === 'Collecting' ? 'bg-blue-200' :
            product.status === 'Delivering' ? 'bg-blue-500' :
            product.status === 'Delivered' ? 'bg-green-500' :
            'bg-[#D9D9D9]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="font-normal">{product.name}</span>
            {product.price && <span className={`font-semibold text-red-500 px-10 ${product.textColor}`}>MVR {product.price}</span>}
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-sm">
              {product.status === 'Sourcing' && <CheckCircleIcon className="w-5 h-5 mr-2 text-red-500" />}
              {product.status === 'No Stock' && <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />}
              {addedProducts.includes(product.id) ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <div className='flex flex-col justify-center items-center'>
                  {product.status === 'Available' && (
                    loadingProductId === product.id ? (
                      <div className="flex flex-col items-center mb-2">
                        <div className="loader border-t-4 border-blue-500 rounded-full w-5 h-5 animate-spin"></div>
                        <span className="text-xs">Adding...</span>
                      </div>
                    ) : (
                      <button onClick={() => handleAvailableClick(product)} className="flex flex-col items-center text-blue-600 hover:text-blue-800 mb-2">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span className="text-xs">Add</span>
                      </button>
                    )
                  )}
                  <span>{product.status}</span>
                </div>
              )}
            </span>
            {['Sourcing', 'No Stock'].includes(product.status) && (
              <button onClick={() => handleEditClick(product)} className="text-gray-600 hover:text-gray-800">
                <PencilIcon className="h-5 w-5" />
                <span className="sr-only">Edit</span>
              </button>
            )}
            <button onClick={() => removeProduct(product.id)} className="text-gray-600 hover:text-gray-800">
              <TrashIcon className="h-5 w-5" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        </div>
      ))}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <button type="button" onClick={() => setIsPopupOpen(false)} className="py-2 px-4 bg-red-500 text-white rounded-md">Cancel</button>
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded-md" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
