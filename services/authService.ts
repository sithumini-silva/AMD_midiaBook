import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const registerPatient = async (
  email: string,
  password: string,
  fullName: string
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    fullName,
    role: "patient",
    createdAt: new Date(),
  });

  return cred;
};

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};
