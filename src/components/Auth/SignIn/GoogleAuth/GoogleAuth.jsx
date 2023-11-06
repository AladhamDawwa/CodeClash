import './style.css'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Button from '@mui/material/Button';

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAVExKbsjFpfkaTgTBxSOHVJfODnlXwUVM",
  authDomain: "code--clash.firebaseapp.com",
  projectId: "code--clash",
  storageBucket: "code--clash.appspot.com",
  messagingSenderId: "966466853907",
  appId: "1:966466853907:web:ec833ec576006a3e31f3e6",
  measurementId: "G-R5SK1W3E7N"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();
function x() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(result);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
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

const GoogleAuth = () => {
  return (
    <div onClick={x} id='GoogleAuth'>
      <Button variant="contained">
        <img width={'15%'} src='./assets/google.svg' alt='google'></img>
        <span>Sign in with Google</span>
      </Button>
    </div>
  )
}
export default GoogleAuth
export{app};