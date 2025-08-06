// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 La tua configurazione reale di Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuVMRTxWrpRR6HzJOHBNrIg3Uwr7JGvhs",
  authDomain: "contabilita--familiare.firebaseapp.com",
  projectId: "contabilita--familiare",
  storageBucket: "contabilita--familiare.firebasestorage.app",
  messagingSenderId: "865629549434",
  appId: "1:865629549434:web:b0da6df4f05a46d3b0dcc3",
  measurementId: "G-VYXVQMG6ZZ"
};

// ✅ Evita inizializzazione multipla (importante in sviluppo con React)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Esporta i servizi che userai
export const auth = getAuth(app);
export const db = getFirestore(app);

// Se vuoi usare Analytics (opzionale)
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);
