// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ6xC_tePrKno9aLT5YVkzjioqmXaRbyM",
  authDomain: "learnkoods-53237.firebaseapp.com",
  projectId: "learnkoods-53237",
  storageBucket: "learnkoods-53237.appspot.com",
  messagingSenderId: "68539838606",
  appId: "1:68539838606:web:8ae953d971f33d747f59df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fireauth = getAuth(app);
