import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore"; 
import { auth, db } from "../../services/firebase";
import { IUser } from "../../models/IUser";

export function firebaseSignUp({firstName, lastName, userName, email, password} : IUser) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);

      (async ()=>
        {
          try {
            const docRef = await addDoc(collection(db, "users"), {
              firstName,
              lastName,
              userName,
              email,
              password
            });
      
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      )();

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      
      // ..
    });
}
