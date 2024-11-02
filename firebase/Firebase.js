// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc, // Import addDoc for adding documents
  onSnapshot,
  getDocs,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider, // hogaya jazakallah ok..
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArZFtAQCORS6ubfujSdH-OrrkerKhmmyo",
  authDomain: "practice-6cbec.firebaseapp.com",
  projectId: "practice-6cbec",
  storageBucket: "practice-6cbec.appspot.com",
  messagingSenderId: "716039944412",
  appId: "1:716039944412:web:d5fe14846ce65594d19c19",
  measurementId: "G-ZZ0VH9T342",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const realtimedb = getDatabase(app); // Initialize Realtime Database

// Export the necessary Firestore functions and Firebase instances
export {
  auth,
  db,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  storage,
  onSnapshot,
  uploadBytesResumable, // Export addDoc for use in the app
  realtimedb,
  getDocs,
  doc,
};
