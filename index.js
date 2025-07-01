import express from "express";
import cors from "cors";
import { extractTextFromImage } from "./utils/ocr.js";
import { extractDataWithLLM } from "./utils/llm.js";
import prompt from "./promptLLM.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Paygurd OCR API is running.");
});

app.post("/processPayslipFromOCR", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ success: false, error: "Missing fileUrl" });
    }

    const rawText = await extractTextFromImage(fileUrl);
    const extractedData = await extractDataWithLLM(rawText, prompt);

    return res.json({ success: true, data: extractedData });
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
