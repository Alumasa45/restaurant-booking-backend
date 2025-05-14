// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj69xrNVcQwUJ03b_IJjaRu7VXU7oC6aE",
  authDomain: "restaurantbooking-da601.firebaseapp.com",
  projectId: "restaurantbooking-da601",
  storageBucket: "restaurantbooking-da601.firebasestorage.app",
  messagingSenderId: "719943181790",
  appId: "1:719943181790:web:88a3439058ae55167a294f",
  measurementId: "G-L9DLHMCTGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// Export Firebase services for use in other files
export { app, analytics, messaging };
