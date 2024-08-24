'use client';

import { useState, useEffect } from 'react';
import CollectInfo from "../(component)/CollectInfo"
import ChinaBoxList from "../(component)/chinaboxlist"
import DeliveryMethod from "../(component)/DeliveryMethod"
import MakeTotal from "../(component)/MakeTotal"
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';  // Make sure this is pointing to your Firestore configuration

export default function ChinaBox() {
    const [deliveryCost, setDeliveryCost] = useState(20); // Default to the first method's cost
    const [chinaBoxItems, setChinaBoxItems] = useState([]);

    useEffect(() => {
        const fetchChinaBoxItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'chinaBoxItems'));
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setChinaBoxItems(items);
            } catch (error) {
                console.error("Error fetching china box items:", error);
            }
        };

        fetchChinaBoxItems();
    }, []);  // Empty dependency array means this effect runs once when the component mounts

    const handleDeliverySelect = (cost) => {
        setDeliveryCost(cost);
    };

    const handleProductAdded = (product) => {
        setChinaBoxItems((prevItems) => [...prevItems, product]);
    };

    const handleProductRemoved = (productId) => {
        setChinaBoxItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    return (
        <div>
            <CollectInfo />

            <section className='chinabox-secc mt-5 flex items-center justify-center flex-col'>
                <h3 className="text-3xl text-center font-bold">
                    <span className="text-black bg-green-500 px-2">Get it in to</span>{""}
                    <span className="bg-red-500 px-2">China Box</span>
                </h3>

                <div className="container mt-5">
                    <ChinaBoxList />
                </div>

                <div className="container grid grid-cols-2 gap-4 mt-5" style={{ width: '100%' }}>
                    <div className="col-span-1" style={{ width:'40%' }}>
                        <DeliveryMethod onDeliverySelect={handleDeliverySelect} />
                    </div>
                    <div className="col-span-1" style={{ width:'60%' }}>
                        <MakeTotal cartItems={chinaBoxItems} deliveryCost={deliveryCost} />
                    </div>
                </div>

                {/* <ProductList onProductAdded={handleProductAdded} onProductRemoved={handleProductRemoved} /> */}
            </section>
        </div>
    );
}
