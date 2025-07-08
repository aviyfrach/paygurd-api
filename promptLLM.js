import express from "express";
import prompt from "./promptLLM.js";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ודא שהמפתח מוגדר בסביבת הריצה
});

router.post("/", async (req, res) => {
  try {
    const { raw_text } = req.body;

    if (!raw_text) {
      return res.status(400).json({ error: "Missing raw_text in request body" });
    }

    // הכנת הודעות לפרומפט עם תפקידים
    const messages = [
      { role: "system", content: prompt },
      { role: "user", content: raw_text },
    ];

    // קריאה ל-OpenAI Chat Completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0,
    });

    // המרת הפלט ל־JSON
    const parsed = JSON.parse(completion.choices[0].message.content);

    return res.json(parsed);
  } catch (error) {
    console.error("Error in processPayslipFromText:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

The response must be valid JSON with no explanations, no formatting issues, and no text outside the object.
`;

export default prompt;
