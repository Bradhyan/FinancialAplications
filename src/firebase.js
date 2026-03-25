import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACiDV_qEmhpEOZ-21lZhN3YsUhM5FLG1k",
  authDomain: "finflow-b4cc8.firebaseapp.com",
  projectId: "finflow-b4cc8",
  storageBucket: "finflow-b4cc8.firebasestorage.app",
  messagingSenderId: "472754382138",
  appId: "1:472754382138:web:9227dbb43070c05227dc03"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
