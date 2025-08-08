// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = { /* ... la tua configurazione ... */ };
const app = initializeApp(firebaseConfig);

// Imposta la persistenza della sessione
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

export { auth, db };
