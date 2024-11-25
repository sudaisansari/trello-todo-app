"use client"
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "@/config/firebase";
import { useUserAuth } from "@/context/AuthContext";
import { RootState } from "../types/types";
import { debounce } from "lodash";

const FirestoreSync = () => {
  console.log("Called sync")
  const { user } = useUserAuth();
  const cardsArray = useSelector((state: RootState) => state.cardsArray || []);
  const isInitialLoad = cardsArray.length === 0;
  console.log("Called initial : ", isInitialLoad)

  // Debounced Firestore Update Function
  const debouncedSync = debounce(async (data) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { cardsArray: data }, { merge: true });
        console.log("Firestore successfully synced:", data);
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  }, 300);


  useEffect(() => {
    if (!isInitialLoad) {
      console.log("Called Sync : ", !isInitialLoad)
      debouncedSync(cardsArray);
    }

    // Cleanup on unmount
    return () => debouncedSync.cancel();
  }, [cardsArray, isInitialLoad, user]);

  return null;
};

export default FirestoreSync;






// const FirestoreSync = () => {
//   const { user } = useUserAuth();
//   const cardsArray = useSelector((state: RootState) => state.cardsArray || []);
//   const isInitialLoad = cardsArray.length === 0;

//   console.log("Current Data Redux : ", cardsArray)
//   const debouncedSync = debounce(async (data) => {
//     if (user) {
//       try {
//         const userRef = doc(db, "users", user.uid);

//         // Fetch current Firestore data for comparison
//         const currentDataSnapshot = await getDoc(userRef);
//         const currentData = currentDataSnapshot.exists()
//           ? currentDataSnapshot.data().cardsArray || []
//           : [];

//           console.log("Current data DB: ", currentData)

//         // Compare current Firestore data with Redux state
//         if (JSON.stringify(currentData) !== JSON.stringify(data)) {
//           await setDoc(userRef, { cardsArray: data }, { merge: true });
//           console.log("Firestore successfully synced:", data);
//         } else {
//           console.log("No changes detected; Firestore not updated.");
//         }
//       } catch (error) {
//         console.error("Error updating Firestore:", error);
//       }
//     }
//   }, 300);

//   useEffect(() => {
//     if (!isInitialLoad) {
//       debouncedSync(cardsArray);
//     }

//     return () => debouncedSync.cancel();
//   }, [cardsArray, isInitialLoad, user]);

//   return null;
// };

// export default FirestoreSync;