import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractDataWithLLM(text, prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    response_format: "json",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ]
  });

  return completion.choices[0].message.content
    ? JSON.parse(completion.choices[0].message.content)
    : {};
}
