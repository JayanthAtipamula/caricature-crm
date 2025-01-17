import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBxmx_f2ods26WngZY_blNYgIzGFsFcTJc",
  authDomain: "cashfree-testing.firebaseapp.com",
  projectId: "cashfree-testing",
  storageBucket: "cashfree-testing.firebasestorage.app",
  messagingSenderId: "858256177834",
  appId: "1:858256177834:web:94ae3af077d53d4db9aed3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);