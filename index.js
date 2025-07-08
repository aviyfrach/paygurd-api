import express from "express";
import cors from "cors";
import { extractTextFromImage } from "./utils/ocr.js";
import { extractDataWithLLM } from "./utils/llm.js";
import processPayslipFromText from "./processPayslipFromText.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// בדיקה שהשרת באוויר
app.get("/", (req, res) => {
  res.send("Paygurd OCR API is running.");
});

// עיבוד תלוש מתוך תמונה (OCR מלא)
app.post("/processPayslipFromOCR", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ success: false, error: "Missing fileUrl" });
    }

    const rawText = await extractTextFromImage(fileUrl);
    const extractedData = await extractDataWithLLM(rawText);

    return res.json({ success: true, data: extractedData });
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
});

// עיבוד טקסט גולמי של תלוש
app.use("/api/processPayslipFromText", processPayslipFromText);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
