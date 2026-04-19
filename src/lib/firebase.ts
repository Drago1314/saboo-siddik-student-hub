import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// User provided config
const firebaseConfig = {
  apiKey: "AIzaSyDlSkk6J7Qsdlh5DkwG1WHxTFyWyIIl1ns",
  authDomain: "saboo-siddik-student-hub.firebaseapp.com",
  projectId: "saboo-siddik-student-hub",
  storageBucket: "saboo-siddik-student-hub.firebasestorage.app",
  messagingSenderId: "934332578641",
  appId: "1:934332578641:web:1363aedd2b84d64299f170",
  measurementId: "G-9TVDLKGEJB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
