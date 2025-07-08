import express from "express";
import { payslipPrompt } from "./promptLLM.js";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // ודא שהמפתח מוגדר בסביבת הריצה שלך
});

router.post("/", async (req, res) => {
  try {
    const { raw_text } = req.body;

    if (!raw_text) {
      return res.status(400).json({ error: "Missing raw_text in request body" });
    }

    // ✂️ חיתוך טקסט ל־7000 תווים כדי למנוע חריגה מהמגבלת טוקנים של GPT-4
    const MAX_TEXT_LENGTH = 7000;
    const safeText = raw_text.length > MAX_TEXT_LENGTH
      ? raw_text.slice(0, MAX_TEXT_LENGTH)
      : raw_text;

    const messages = [
      { role: "system", content: payslipPrompt },
      { role: "user", content: safeText },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    return res.json(parsed);
  } catch (error) {
    console.error("Error in processPayslipFromText:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

