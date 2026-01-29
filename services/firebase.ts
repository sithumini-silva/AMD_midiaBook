// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBimqwTe6wHq6nybRJcdD2GdclS8z37K2c",
  authDomain: "mbook-97ee1.firebaseapp.com",
  projectId: "mbook-97ee1",
  storageBucket: "mbook-97ee1.firebasestorage.app",
  messagingSenderId: "129274064552",
  appId: "1:129274064552:web:b75e82c7e57394adfc5c9d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
