import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebase_config = require("./config/firebase").firebase
initializeApp({
  credential: cert(firebase_config)
})

// firestore
const firestore = getFirestore()
export const db = {
  users: firestore.collection("users")
}


