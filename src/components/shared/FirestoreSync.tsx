"use client"
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "@/app/firebase"; // Adjust path
import { useUserAuth } from "@/components/context/AuthContext";
import { RootState } from "./types";

const FirestoreSync = () => {
  const { user } = useUserAuth(); // Hook to get the logged-in user
  const cardsArray = useSelector((state: RootState) => state.cardsArray || []);
  console.log("User ID : ", user?.uid, "Cards Array : ", cardsArray)

  useEffect(() => {
    const updateFirestore = () => {
      if (user && cardsArray) {
        try {
          const userRef = doc(db, "users", user.uid);
          console.log("Updating Firestore for user:", user.uid);
           setDoc(userRef, { cardsArray }, { merge: true });
          console.log("User ID : ", user.uid, "Cards Array : ", cardsArray)
          console.log("Data successfully updated in Firestore");
        } catch (error) {
          console.error("Error updating Firestore:", error);
        }
      }
    };
    updateFirestore();
  }, [cardsArray, user]); // Update Firestore when `cardsArray` or `user` changes

  return null; // Component doesn’t render anything visible
};

export default FirestoreSync;
