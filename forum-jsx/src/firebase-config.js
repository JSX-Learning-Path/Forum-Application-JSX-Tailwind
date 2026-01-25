// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC8Tb-Dn_c2MWMFI6Wp00_rYowBF2idBqQ",
  authDomain: "example-736cb.firebaseapp.com",
  databaseURL: "https://example-736cb-default-rtdb.firebaseio.com",
  projectId: "example-736cb",
  storageBucket: "example-736cb.firebasestorage.app",
  messagingSenderId: "611586595766",
  appId: "1:611586595766:web:683e203aac1f676f383f17",
  measurementId: "G-DBWWT06677"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);