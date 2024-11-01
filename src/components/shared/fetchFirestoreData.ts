// // Import necessary Firebase functions
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/app/firebase"; // Adjust the path based on your project structure

// // Function to fetch the user's `cardsArray` from Firestore
// export const fetchUserData = async (userId: string) => {
//     try {
//         // Reference to the user's document in Firestore
//         const userRef = doc(db, "users", userId);

//         // Fetch the document
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//             // Extract and return the `cardsArray` data
//             return userDoc.data()?.cardsArray;
//         } else {
//             console.error("User document not found!");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching data from Firestore:", error);
//         throw error;
//     }
// };



import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
interface CardData {
    id: string;
    title: string;
    inputs: Array<{ id: string; value: string }>; // Adjust based on the structure of your data
  }
export const subscribeToUserData = (userId: string, callback: (data: CardData[]) => void) => {
  const userRef = doc(db, "users", userId);

  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data()?.cardsArray || []); // Call the callback with fetched data
    } else {
      console.error("User document not found!");
      callback([]);
    }
  });
};

