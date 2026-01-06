// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Use secure config (never hardcode key)
const GEMINI_API_KEY = functions.config().gemini.key;

exports.chatWithGemini = functions.https.onRequest(async (req, res) => {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 512,
        },
      }
    );

    const reply = response.data.candidates[0]?.content?.parts[0]?.text || "I'm here for you. 🌿";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    res.status(500).json({ error: "Unable to reach AI. Please try again." });
  }
});