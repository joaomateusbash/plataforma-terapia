import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBT4ZdjS01SCfpB8WISe0plKHMBG7besAQ",
  authDomain: "plataforma-terapia.firebaseapp.com",
  projectId: "plataforma-terapia",
  storageBucket: "plataforma-terapia.firebasestorage.app",
  messagingSenderId: "1059838082837",
  appId: "1:1059838082837:web:44ef3c276d031b6c31331c",
  measurementId: "G-RFBLCLPDBP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);