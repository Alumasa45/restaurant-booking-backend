const express = require("express");
const { askChatGPT } = require("../aiService");

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const response = await askChatGPT(message);
  res.json({ response });
});

module.exports = router;
