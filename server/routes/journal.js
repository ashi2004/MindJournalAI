const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const JournalEntry = require("../models/JournalEntry");
// import { GoogleGenAI } from "@google/genai";
const axios = require("axios");

// require('dotenv').config();

const router = express.Router();

// const ai = new GoogleGenAI({});

async function analyzeTextWithGemini(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-1.5-flash"; // or gemini-2.5-pro for deeper analysis

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
// Analyze the following journal entry and return a valid JSON object only. 
// Do not include markdown, explanations, or text outside of the JSON.
Analyze the following journal entry deeply.
1. Detect the overall sentiment (positive, negative, neutral, or mixed).
2. Identify the main mood of the writer in a single word (e.g., happy, anxious, sad, excited).
3. Extract key themes as a list (e.g., relationships, stress, work, family, health).
4. Provide a calmingMessage or advice written in a warm, empathetic, and supportive tone, as if a caring friend is responding and acknowledging the feelings in detail.
5. Suggest ONE single Unicode emoji character (not name, not multiple emojis) that best matches the overall emotional tone and themes of the entry.
6. Recommend 2 to 3 relevant external resources based on the entry,
// which may include articles, videos, or podcasts.
// For each resource provide:
// "title": short title,
// "description": brief description,
// "url": direct link to the resource.
// Ensure at least one video link is included when suitable.
Return the result strictly in JSON with keys: sentiment, mood, themes, calmingMessage, emoji, recommendations.

Journal Entry: "${text}"

Format:
{
  "sentiment": "positive | negative | neutral | mixed",
  "mood": "string",
  "themes": ["array of key themes"],
  "calmingMessage": "string",
  "emoji": "single unicode emoji character",
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "url": "string"
    }
  ]
}
`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    const candidates = response.data.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini");
    }

    let textResponse =
      candidates[0]?.content?.parts?.map((p) => p.text).join("") || "";
    if (!textResponse) {
      throw new Error("Empty response from Gemini");
    }

    // Remove ```json or ``` fences if Gemini includes them
    textResponse = textResponse.replace(/```json|```/g, "").trim();

    let analysis;
    try {
      console.log(
        "Raw Gemini response:",
        JSON.stringify(response.data, null, 2)
      );
      analysis = JSON.parse(textResponse);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", textResponse);
      throw e;
    }

    return analysis;
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    return {
      sentiment: "neutral",
      mood: "neutral",
      themes: [],
      calmingMessage: "Take some time to breathe and relax.",
      emoji: "🙂",
       recommendations:[],
      fallback: true
    };
  }
}

// Your POST route
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { entryDate, mood, text } = req.body;

    const analysis = await analyzeTextWithGemini(text);

    const journalEntry = new JournalEntry({
      user: req.user,
      entryDate: entryDate ? new Date(entryDate) : Date.now(),
      mood: analysis.mood || "neutral",
      text,
      sentiment: analysis.sentiment,
      themes: analysis.themes,
      calmingMessage: analysis.calmingMessage || "Take some time to breathe and relax.",
      emoji: analysis.emoji || "🙂",
      recommendations: analysis.recommendations || []
    });

    await journalEntry.save();
  res.status(201).json({
  ...journalEntry.toObject(),
  calmingMessage: analysis.calmingMessage || "Take some time to breathe and relax.",
  emoji: analysis.emoji || "🙂",
  recommendations: analysis.recommendations || []
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all entries for logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default 10 entries per page
    const skip = (page - 1) * limit;

    const total = await JournalEntry.countDocuments({ user: req.user });
    const entries = await JournalEntry.find({ user: req.user })
      .sort({ entryDate: -1 })
      .skip(skip)
      .limit(limit)
      .select("entryDate mood sentiment themes emoji text");

    res.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an entry by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });

  const { entryDate, text } = req.body;

    if (entryDate) entry.entryDate = new Date(entryDate);

    if (text) {
      entry.text = text;

      // Re-analyze the updated text with Gemini
      const analysis = await analyzeTextWithGemini(text);

      entry.sentiment = analysis.sentiment;
      entry.mood = analysis.mood;
      entry.themes = analysis.themes;
      entry.emoji = analysis.emoji || "🙂";

    } else if (req.body.mood) {
      // Optional: allow manual mood update if no text changed
      entry.mood = req.body.mood;
    }

    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an entry by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Analytics route: get mood & sentiment over time for user
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user })
      .select("sentiment mood entryDate")
      .sort({ entryDate: 1 });
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single journal entry by ID (for details page)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
