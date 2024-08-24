// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmthIwWrkg9mCbPMY4DrfkjDHeg7MKAx0",
  authDomain: "chinabox-f4e8d.firebaseapp.com",
  projectId: "chinabox-f4e8d",
  storageBucket: "chinabox-f4e8d.appspot.com",
  messagingSenderId: "1036977254662",
  appId: "1:1036977254662:web:66be1e942c0f16781e6e87",
  measurementId: "G-3C38D7EP13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };