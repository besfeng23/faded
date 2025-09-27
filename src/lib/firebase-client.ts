import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAvjVjhXFMI7QNJ-RFXiTOj5zm2MlYNGME",
    authDomain: "agile-anagram-469914-e2.firebaseapp.com",
    projectId: "agile-anagram-469914-e2",
    storageBucket: "agile-anagram-469914-e2.appspot.com",
    messagingSenderId: "78849214378",
    appId: "1:78849214378:web:0f8ec9ab62dd966bc68dd3",
    measurementId: "G-Z46NM7ESV6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}


export { app, auth, db, storage, analytics };
