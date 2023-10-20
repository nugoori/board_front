// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8dLPyIVc_XPr4uA5QOWPGGB4zWNLvqHk",
  authDomain: "board-eb3b1.firebaseapp.com",
  projectId: "board-eb3b1",
  storageBucket: "board-eb3b1.appspot.com",
  messagingSenderId: "1021241097573",
  appId: "1:1021241097573:web:54051edaca5fc4a77b758c",
  measurementId: "G-9YN7DQ4PXE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);