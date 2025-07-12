// Replace with your own Firebase project config
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCvujFScGiXFo_JWv6pXAUKyIap-BR05ys",
  authDomain: "test-21604.firebaseapp.com",
  projectId: "test-21604",
  storageBucket: "test-21604.firebasestorage.app",
  messagingSenderId: "235639460723",
  appId: "1:235639460723:web:9961fd687dc713a179ab06",
  measurementId: "G-RHFV06NH3M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
