// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import add karo

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdrMGDBPMq2jepKbYmiNlARYfL-2uWJek",
  authDomain: "insurance-system-cdd75.firebaseapp.com",
  projectId: "insurance-system-cdd75",
  storageBucket: "insurance-system-cdd75.firebasestorage.app",
  messagingSenderId: "695060327299",
  appId: "1:695060327299:web:8217e47ed30615af18a4b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore ko initialize karo
export const db = getFirestore(app); // ye line missing thi

// ✅ Default export (optional)
export default app;
