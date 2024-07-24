import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { fireauth } from "@/app/firebase";

const AuthContext = createContext({
  user: null,
  loading: false,
  fetchedUser: null,
  googleSignin: () => {},
  logOut: () => {},
  setFetchedUser: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);

  const googleSignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true); // Set loading to true when starting sign-in process
      await signInWithPopup(fireauth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false); // Set loading to false after sign-in process
    }
  };

  const logOut = async () => {
    try {
      setLoading(true); // Set loading to true when starting log-out process
      await signOut(fireauth);
      setFetchedUser(null); // Clear fetched user data on logout
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setLoading(false); // Set loading to false after log-out process
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireauth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after auth state is resolved
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchedUser,
        googleSignin,
        logOut,
        setFetchedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
