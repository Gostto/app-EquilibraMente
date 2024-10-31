import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBys8W-gBeHX5NqykMD5D_rgqssDHBEJj8",
  authDomain: "equilbramente.firebaseapp.com",
  projectId: "equilbramente",
  storageBucket: "equilbramente.appspot.com",
  messagingSenderId: "851156889902",
  appId: "1:851156889902:web:5d5accd7b49d10ebe94abf",
  measurementId: "G-W7JH82RN2J"
};

// Inicialize apenas se o Firebase ainda não tiver sido inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export default app;