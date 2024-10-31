// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0nHQ4qCQMTw0a78DGxTX6clyBQdoQ4kY",
  authDomain: "trello-todo-app.firebaseapp.com",
  projectId: "trello-todo-app",
  storageBucket: "trello-todo-app.appspot.com",
  messagingSenderId: "421082313716",
  appId: "1:421082313716:web:f5c92d6fc2bacb42aeffa1",
  measurementId: "G-041CWJ57T5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore
