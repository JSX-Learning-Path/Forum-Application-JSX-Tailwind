// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBYb0DmcCrxCf2DjsOVRpdN2lFMKcgI88U",
//   authDomain: "forumjsx-857df.firebaseapp.com",
//   databaseURL:
//     "https://forumjsx-857df-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "forumjsx-857df",
//   storageBucket: "forumjsx-857df.firebasestorage.app",
//   messagingSenderId: "967789365940",
//   appId: "1:967789365940:web:e601d578203bebac1325e1",
//   measurementId: "G-PJJ8ZQLWHG",
// };

//моя база данни
const firebaseConfig = {
  apiKey: "AIzaSyCzs8JBhq7YaWIM9VBylsypEBBTjEc3WYA",
  authDomain: "forym-example.firebaseapp.com",
  databaseURL: "https://forym-example-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forym-example",
  storageBucket: "forym-example.firebasestorage.app",
  messagingSenderId: "461084698410",
  appId: "1:461084698410:web:941ad3cf2ee0465219e053",
  measurementId: "G-GNJ4CFC43Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { app };
