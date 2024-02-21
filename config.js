import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBumFA5AfRzlq39FH0eb9mfA2ndNlpxqRA",
  authDomain: "sallon-9a41d.firebaseapp.com",
  projectId: "sallon-9a41d",
  storageBucket: "sallon-9a41d.appspot.com",
  messagingSenderId: "871352006740",
  appId: "1:871352006740:web:8af23110dea8211abed5c1",
  measurementId: "G-9HMGYS2YZ9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
