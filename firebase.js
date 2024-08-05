// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi4oDj2yHIfgL3HBpPw8fiCBJ1gL9ibHw",
  authDomain: "inventory-management-8ddbf.firebaseapp.com",
  projectId: "inventory-management-8ddbf",
  storageBucket: "inventory-management-8ddbf.appspot.com",
  messagingSenderId: "715381452689",
  appId: "1:715381452689:web:4fe29245469a7309d37430",
  measurementId: "G-QR5NZRQMT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}