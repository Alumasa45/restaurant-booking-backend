const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController.js");

router.post("/chat", chatbotController.chatbotResponse);

module.exports = router;

