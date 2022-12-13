// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC3ta0oT7yin6jswkMXnXzK370ktTYR-o",
  authDomain: "lagrange-extrapolation-auth.firebaseapp.com",
  projectId: "lagrange-extrapolation-auth",
  storageBucket: "lagrange-extrapolation-auth.appspot.com",
  messagingSenderId: "68281463262",
  appId: "1:68281463262:web:d3bb0c6199e42ccb4b2d4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)