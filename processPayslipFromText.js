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

    const messages = [
      { role: "system", content: payslipPrompt },
      { role: "user", content: raw_text },
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
