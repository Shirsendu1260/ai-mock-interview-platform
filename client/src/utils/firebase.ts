// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
// Need to add authorized domains (localhost/vercel deployed app url) in FireBase Console > Authentication > Settings > Authorized Domains
// Need to add domain (localhost/vercel deployed app url) in GitHub OAuth app settings

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Enable Google auth
const googleAuthProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => await signInWithPopup(auth, googleAuthProvider);

// Enable GitHub auth
const githubAuthProvider = new GithubAuthProvider();
const signInWithGitHub = async () => await signInWithPopup(auth, githubAuthProvider);

export {
  signInWithGoogle,
  signInWithGitHub
};