import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAakq37z6ai7aStdnmpA34UQ6m9vv6rQHs",
  authDomain: "tasteandflavor-25712.firebaseapp.com",
  projectId: "tasteandflavor-25712",
  storageBucket: "tasteandflavor-25712.appspot.com",
  messagingSenderId: "1090860117635",
  appId: "1:1090860117635:web:390057f5551af423b675b6",
  measurementId: "G-QPC5Q62HBK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {app,auth};