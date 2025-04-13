import { auth, googleProvider } from "./Firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { app } from "./Firebase";

import {
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const googleSignIn = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    alert("Google Sign-In Successful!");
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password Reset Email Sent!");
  } catch (error) {
    console.error("Reset Error:", error);
  }
};

export const verifyEmail = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    alert("Verification Email Sent!");
  } catch (error) {
    console.error("Email Verification Error:", error);
  }
};
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
