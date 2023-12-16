import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();
export function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(result);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
