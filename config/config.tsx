// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoNge24Dx4s2e4GyRoG8P5Nl1uzrFr2ko",
  authDomain: "bobmakeuoft.firebaseapp.com",
  databaseURL: "https://bobmakeuoft-default-rtdb.firebaseio.com",
  projectId: "bobmakeuoft",
  storageBucket: "bobmakeuoft.firebasestorage.app",
  messagingSenderId: "988330952674",
  appId: "1:988330952674:web:9bf8965e01c969cf9d1bbb",
  measurementId: "G-65MW3WL929"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);