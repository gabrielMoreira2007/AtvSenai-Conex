import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAnj0HBFoP3tRuu5wuzYojorx7zvBO6uoA",
  authDomain: "atv-redesocial-conex.firebaseapp.com",
  projectId: "atv-redesocial-conex",
  storageBucket: "atv-redesocial-conex.firebasestorage.app",
  messagingSenderId: "173298216182",
  appId: "1:173298216182:web:03b8f085e0ebd9b5d8d0d7",
  measurementId: "G-DXYLQJ6PNX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
