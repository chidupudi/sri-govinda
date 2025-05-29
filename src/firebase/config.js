// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc2Dpn_MG9vLIrdV-c_8kt4kpqWT9syDk",
  authDomain: "sri-govinnda.firebaseapp.com",
  projectId: "sri-govinnda",
  storageBucket: "sri-govinnda.firebasestorage.app",
  messagingSenderId: "297904124723",
  appId: "1:297904124723:web:422301fa887cf9440b0446",
  measurementId: "G-5PM4TBHLBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;