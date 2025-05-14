import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebaseConfig";

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Function to request permission for notifications
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("🔔 Notification permission granted.");
      return await getMessagingToken(); // Ensure the token is returned
    } else {
      console.log("🚫 Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return null;
  }
};

// Function to get FCM token
export const getMessagingToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BGRp71Q6Ow_zzcDQKWvMvQtwP8cFDxu2g_PPJ634j9Q-MLn2sFD6-rg8IqYCDcBAJezFIR66dKAJSoslHU5ZmAE",
    });

    if (token) {
      console.log("🔥 Your FCM Token:", token); // ✅ LOGGING TOKEN HERE
      return token; // ✅ Explicitly returning token
    } else {
      console.warn("⚠️ No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// Function to listen for incoming messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Message received:", payload);
      resolve(payload);
    });
  });
