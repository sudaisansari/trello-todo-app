"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/app/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import nookies from "nookies";

interface AuthContextType {
  user: User | null;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    setUser(result.user);

    // Set token in cookies
    nookies.set(undefined, "authToken", token, { path: "/" });
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    nookies.destroy(undefined, "authToken", { path: "/" });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        nookies.set(undefined, "authToken", token, { path: "/" });
        setUser(currentUser);
      } else {
        nookies.destroy(undefined, "authToken", { path: "/" });
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(AuthContext)!;
