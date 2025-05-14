const { OpenAI } = require("openai");

require("dotenv").config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from .env
});

// Function to send a message to ChatGPT
const askChatGPT = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: message }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    return `Error: ${error.message}`;
  }
};


module.exports = { askChatGPT };
