// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOSfpKvZ4Kqp7NlHhoByLUUeFHybJMuyQ",
  authDomain: "filmdatabase-fb159.firebaseapp.com",
  projectId: "filmdatabase-fb159",
  storageBucket: "filmdatabase-fb159.appspot.com",
  messagingSenderId: "966443360257",
  appId: "1:966443360257:web:e48cc846e281b881fb2000",
  measurementId: "G-7ZYN4GSLSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };