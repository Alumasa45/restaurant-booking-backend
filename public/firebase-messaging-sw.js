importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Firebase configuration (Use your own credentials)
firebase.initializeApp({
  apiKey: "AIzaSyAj69xrNVcQwUJ03b_IJjaRu7VXU7oC6aE",
  authDomain: "restaurantbooking-da601.firebaseapp.com",
  projectId: "restaurantbooking-da601",
  storageBucket: "restaurantbooking-da601.firebasestorage.app",
  messagingSenderId: "719943181790",
  appId: "1:719943181790:web:88a3439058ae55167a294f",
  measurementId: "G-L9DLHMCTGM",
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[Firebase Messaging] Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // You can replace this with your app's logo
  });
});
