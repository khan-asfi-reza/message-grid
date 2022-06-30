import { useState, useEffect } from "react";
import { auth, githubAuthProvider, googleAuthProvider } from "../firebase.conf";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };
  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    await auth.createUserWithEmailAndPassword(email, password);
  };

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  const signInWithGithub = async () => {
    await auth.signInWithPopup(githubAuthProvider);
  };

  const signOut = () => auth.signOut().then(clear);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithGoogle,
    signInWithGithub,
  };
}
