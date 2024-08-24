import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';  


import DeliveryInfo from "../(component)/DeliveryInfo";
import PaymentMethod from "../(component)/PaymentMethod";

export default function CheckOut() {


    return(


        <div>
            <DeliveryInfo/>
            <PaymentMethod/>
        </div>
    );
}