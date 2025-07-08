import express from "express";
import cors from "cors";
import { extractTextFromImage } from "./utils/ocr.js";
import { extractDataWithLLM } from "./utils/llm.js";
import prompt from "./promptLLM.js";
import processPayslipFromText from "./processPayslipFromText.js"; // חיבור הראוטר החדש

const app = express();

// הגדרות CORS ופרסינג JSON עם הגבלת גודל
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// נתיב בדיקה פשוט
app.get("/", (req, res) => {
  res.send("Paygurd OCR API is running.");
});

// עיבוד תמונה ל־OCR וחילוץ נתונים
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

// חיבור ראוטר שמטפל בנתיב /api/processPayslipFromText
app.use("/api/processPayslipFromText", processPayslipFromText);

// הפעלת השרת על פורט מוגדר או 3000 כברירת מחדל
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
