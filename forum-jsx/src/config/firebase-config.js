// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYb0DmcCrxCf2DjsOVRpdN2lFMKcgI88U",
  authDomain: "forumjsx-857df.firebaseapp.com",
  databaseURL:
    "https://forumjsx-857df-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forumjsx-857df",
  storageBucket: "forumjsx-857df.firebasestorage.app",
  messagingSenderId: "967789365940",
  appId: "1:967789365940:web:e601d578203bebac1325e1",
  measurementId: "G-PJJ8ZQLWHG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
