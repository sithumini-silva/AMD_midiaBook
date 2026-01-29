import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { registerPatient as registerPatientService } from "../services/authService";

export default function useAuth() {
  const { user, loading } = useContext(AuthContext);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const registerPatient = async (email: string, password: string) => {
    try {
      const res = await registerPatientService(email, password);
      return res;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    loading,
    login,
    registerPatient,
    logout,
  };
}
