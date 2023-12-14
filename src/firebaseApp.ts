// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1OMQN6csLQOMFWOPCFU2yI7MRkCETA3Q",
  authDomain: "planner-2198f.firebaseapp.com",
  projectId: "planner-2198f",
  storageBucket: "planner-2198f.appspot.com",
  messagingSenderId: "546124046976",
  appId: "1:546124046976:web:3197f969690e3f2772fc65",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
