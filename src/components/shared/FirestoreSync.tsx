// "use client"
// import { useEffect } from "react";
// import { doc, setDoc } from "firebase/firestore";
// import { useSelector } from "react-redux";
// import { db } from "@/app/firebase"; // Adjust path
// import { useUserAuth } from "@/components/context/AuthContext";
// import { RootState } from "./types";

// const FirestoreSync = () => {
//   const { user } = useUserAuth(); // Hook to get the logged-in user
//   const cardsArray = useSelector((state: RootState) => state.cardsArray || []);
//   console.log("User ID : ", user?.uid, "Cards Array : ", cardsArray)
//   console.log("Cards Array Initial length ", cardsArray.length)

//   useEffect(() => {
//     const updateFirestore = () => {
//       if (user && cardsArray) {
//         try {
//           const userRef = doc(db, "users", user.uid);
//            setDoc(userRef, { cardsArray }, { merge: true });
//           console.log("User ID : ", user.uid, "Cards Array : ", cardsArray)
//           console.log("Data successfully updated in Firestore");
//         } catch (error) {
//           console.error("Error updating Firestore:", error);
//         }
//       }
//     };
//     updateFirestore();
//   }, [cardsArray, user]); // Update Firestore when `cardsArray` or `user` changes

//   return null; // Component doesn’t render anything visible
// };

// export default FirestoreSync;



"use client"
import { useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { db } from "@/app/firebase";
import { useUserAuth } from "@/components/context/AuthContext";
import { RootState } from "./types";
import { setCardsArray } from "@/app/redux/slice"; // action to update Redux state

const FirestoreSync = () => {
  const { user } = useUserAuth();
  const dispatch = useDispatch();
  const cardsArray = useSelector((state: RootState) => state.cardsArray || []);
  const isInitialLoad = cardsArray.length === 0; // Check if Redux state is initial

  useEffect(() => {
    const fetchData = async () => {
      if (user && isInitialLoad) { // Only fetch if user is signed in and Redux has initial state
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          dispatch(setCardsArray(data.cardsArray)); // Populate Redux with Firestore data
        }
      }
    };

    fetchData();
  }, [user, isInitialLoad, dispatch]);

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
  }, [cardsArray, user, isInitialLoad]);

  return null;
};

export default FirestoreSync;
