// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4_oxjpMz1yrGU9NHFTdER9PxKyhdGTYo",
  authDomain: "examen2do-f565b.firebaseapp.com",
  projectId: "examen2do-f565b",
  storageBucket: "examen2do-f565b.firebasestorage.app",
  messagingSenderId: "58767404894",
  appId: "1:58767404894:web:1688ccf18f3d51637269cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };