// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { doc, onSnapshot } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore


// Firestore Sync
// export const updateFirestoreData = (user: User | null, isInitialLoad: boolean, cardsArray: RootState) => {
//     if (user && !isInitialLoad) { // Only sync to Firestore if data is loaded and modified
//         try {
//             const userRef = doc(db, "users", user.uid);
//             setDoc(userRef, { cardsArray }, { merge: true });
//         } catch (error) {
//             console.error("Error updating Firestore:", error);
//         }
//     }
// };




// Redux Update Function
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
            id: string;
            content: string;
            dateTime: string;
        }[];
    }>;
}
//callback: (data: CardData[]) => void
export const fetchDataFromFirebase = (userId: string, callback: (data: CardData[]) => void) => {
    const userRef = doc(db, "users", userId);
    
    // onSnapshot(doc(db, "users", userId), (doc) => {
    //     console.log("Current data: ", doc.data());
    //     MdAirlineSeatLegroomReduced(doc.ddR\)
    // });
    
    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            const fetch = doc.data()?.cardsArray || []
            callback(fetch); // Call the callback with fetched data
            //console.log("Firestore data Fetched:", doc.data()?.cardsArray);
        } else {
            console.error("User document not found!");
            callback([]);
        }
    });
};
