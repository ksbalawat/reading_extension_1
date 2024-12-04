const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

// Cohere API setup
const COHERE_API_URL = "https://api.cohere.ai/generate";
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Routing - Home route
app.get("/", (req, res) => {
  res.send("Welcome to the AI Web Extension Backend");
});

// API endpoint for getting context using Cohere
app.post("/api/context", async (req, res) => {
  const { selectedText } = req.body;

  if (!selectedText) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Make request to Cohere API
    const response = await axios.post(
      COHERE_API_URL,
      {
        model: "command", // Use the correct model ID
        prompt: `Explain the contextual meaning of the following text: "${selectedText}"`,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cohere API Response:", response.data);

    const explanation = response.data.generations?.[0]?.text || "No explanation generated";

    // Save the explanation and selected text in the database
    const newContext = await prisma.context.create({
      data: { selectedText, explanation },
    });

    res.json(newContext);
  } catch (error) {
    console.error("Error processing AI:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI processing failed",
      details: error.response?.data?.message || error.message,
    });
  }
});

// Test endpoint to check Cohere API
app.post("/api/test-cohere", async (req, res) => {
  try {
    const response = await axios.post(
      COHERE_API_URL,
      {
        model: "command", // Use the correct model ID
        prompt: "Explain 'Artificial Intelligence' in simple terms.",
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ result: response.data.generations?.[0]?.text.trim() });
  } catch (error) {
    console.error("Error from Cohere API:", error.response?.data || error.message);
    res.status(500).json({
      error: "Error communicating with Cohere",
      details: error.response?.data?.message || error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
