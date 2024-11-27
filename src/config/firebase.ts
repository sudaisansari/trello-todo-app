// Import the functions you need from the SDKs you need
import { Cards } from "@/types/types";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"; // Import Firestore
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// functions
export const fetchDataFromFirebase = (userId: string, callback: (data: Cards[]) => void) => {
    const userRef = doc(db, "users", userId);

    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            const fetch = doc.data()?.cardsArray || []
            console.log("fetch ", fetch)
            callback(fetch); // Call the callback with fetched data
            //console.log("Firestore data Fetched:", doc.data()?.cardsArray);
        } else {
            console.error("User document not found!");
            callback([]);
        }
    });
};

// fetch particular user firestore data and delete its card
export const deleteCardFromFirestore = async (userId: string, cardId: string) => {
    const userRef = doc(db, "users", userId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.cardsArray) {
                const updatedCardsArray = userData.cardsArray.filter((card: Cards) => card.id !== cardId);
                await updateDoc(userRef, { cardsArray: updatedCardsArray });
                console.log("Card deleted successfully");
            } else {
                console.error("Cards array not found in user document");
            }
        } else {
            console.error("User document not found!");
        }
    } catch (error) {
        console.error("Error deleting card:", error);
    }
};

// add new card 
export const addCardToFirestore = async (userId: string, newCard: Cards) => {
    const userRef = doc(db, "users", userId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.data.length >= 0) {
            const userData = userDoc.data();
            if (userData && userData.cardsArray) {
                const updatedCardsArray = [...userData.cardsArray, newCard];
                await updateDoc(userRef, { cardsArray: updatedCardsArray });
                console.log("Card added successfully");
            } else {
                console.error("Cards array not found in user document");
            }
        } else {
            console.error("User document not found!");
        }
    } catch (error) {
        console.error("Error adding card:", error);
    }
};

// delete input 
export const deleteInputFromFirestore = async (userId: string, inputId: string) => {
    const userRef = doc(db, "users", userId);

    try {
        // Fetch the user's document
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Check if cardsArray exists in the document
            if (userData && userData.cardsArray) {
                // Locate the card containing the input to delete
                const updatedCardsArray = userData.cardsArray.map((card: Cards) => {
                    if (card.inputs.some((input) => input.id === inputId)) {
                        // Remove the specific input
                        return {
                            ...card,
                            inputs: card.inputs.filter((input) => input.id !== inputId),
                        };
                    }
                    return card;
                });

                // Update Firestore with the modified cardsArray
                await updateDoc(userRef, { cardsArray: updatedCardsArray });
                console.log("Input deleted from Firestore.");
            } else {
                console.error("No cardsArray found in the user's data.");
            }
        } else {
            console.error("User document not found.");
        }
    } catch (error) {
        console.error("Error deleting input from Firestore:", error);
    }
};


// update whole cardsdata of particular user
export const updateCardsDataInFirestore = async (userId: string, updatedCardsArray: Cards[]) => {
    console.log("adding in db")
    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, { cardsArray: updatedCardsArray });
        console.log("Cards data updated in Firestore.");
    } catch (error) {
        console.error("Error updating cards data in Firestore:", error);
    }
};

export const cardSignUp = async (userId: string) => {
    console.log("Called")
    const userRef = doc(db, "users", userId);
    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            await setDoc(userRef, { cardsArray: [] }, { merge: true });
            console.log("Cards data updated in Firestore.");
        } else {
            console.log("Doc Exists")
        }
    } catch (error) {
        console.error("Error updating cards data in Firestore:", error);
    }
}