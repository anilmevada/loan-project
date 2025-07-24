// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "apex-finance-hub",
  "appId": "1:118651442741:web:4adefa8dce756eecb4037c",
  "storageBucket": "apex-finance-hub.firebasestorage.app",
  "apiKey": "AIzaSyBEs1AU1f0zHQCsACxbqIjyftK4nY4Eb58",
  "authDomain": "apex-finance-hub.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "118651442741"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
