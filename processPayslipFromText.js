import express from 'express';
import { payslipPrompt } from './utils/promptLLM.js';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { raw_text } = req.body;

  if (!raw_text) {
    return res.status(400).json({ error: 'Missing raw_text in request body' });
  }

  try {
    const messages = [
      { role: 'system', content: payslipPrompt },
      { role: 'user', content: raw_text },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    res.json(
