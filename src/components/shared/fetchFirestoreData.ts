
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

interface CardData {
  id: string;
  title: string;
  inputs: Array<{
    id: string;
    value: string;
    description: string;
    dateTime: string;
    watching: boolean;
    activity: {
      id: string; // Unique identifier for each activity entry
      content: string; // Stores rich text as HTML string
      dateTime: string; // Timestamp for activity
    }[];
  }>; // Adjust based on the structure of your data
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

