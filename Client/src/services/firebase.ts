import { getAuth } from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVExKbsjFpfkaTgTBxSOHVJfODnlXwUVM",
  authDomain: "code--clash.firebaseapp.com",
  projectId: "code--clash",
  storageBucket: "code--clash.appspot.com",
  messagingSenderId: "966466853907",
  appId: "1:966466853907:web:ec833ec576006a3e31f3e6",
  measurementId: "G-R5SK1W3E7N",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth();
