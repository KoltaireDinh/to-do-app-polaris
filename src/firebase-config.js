import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAGJ9ldu2fO3ftyPdQSoNrdfJ4zEY4hQbs",
    authDomain: "to-do-app-b4ee5.firebaseapp.com",
    projectId: "to-do-app-b4ee5",
    storageBucket: "to-do-app-b4ee5.firebasestorage.app",
    messagingSenderId: "449692908878",
    appId: "1:449692908878:web:7cf349d5e7d3f13762b21f",
    measurementId: "G-Q5X7Y6CPBW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };