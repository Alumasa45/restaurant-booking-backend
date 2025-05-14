const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json"); // Ensure this file exists

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
