"use client"
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "@/app/firebase";
import { useUserAuth } from "@/components/context/AuthContext";
import { RootState } from "./types";

const FirestoreSync = () => {
  const { user } = useUserAuth();
  const cardsArray = useSelector((state: RootState) => state.cardsArray || []);
  const isInitialLoad = cardsArray.length === 0; // Check if Redux state is initial


  useEffect(() => {
    const updateFirestore = () => {
      if (user && !isInitialLoad) { // Only sync to Firestore if data is loaded and modified
        try {
          const userRef = doc(db, "users", user.uid);
          setDoc(userRef, { cardsArray }, { merge: true });
        } catch (error) {
          console.error("Error updating Firestore:", error);
        }
      }
    };
    updateFirestore();
  }, [cardsArray, isInitialLoad, user]);

  return null;
};

export default FirestoreSync;


