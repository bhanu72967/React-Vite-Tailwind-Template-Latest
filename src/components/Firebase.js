// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  where,
  doc,
  arrayRemove,
  arrayUnion,
  getDoc,
  query,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFwNbFGO93OgmD8HHVA-DY2KmAxc-O_RI",
  authDomain: "instaclone-cc45e.firebaseapp.com",
  projectId: "instaclone-cc45e",
  storageBucket: "instaclone-cc45e.firebasestorage.app",
  messagingSenderId: "1062508577115",
  appId: "1:1062508577115:web:d8ebbc951deebf64069a7e",
  measurementId: "G-9TMQHKH4SN",
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app);
export const storage = getStorage(app);

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User successfully logged out");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
export {
  db,
  auth,
  collection,
  onSnapshot,
  addDoc,
  getAuth,
  getDocs,
  query,
  deleteDoc,
  where,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  arrayRemove,
};
