import Tesseract from "tesseract.js";

export async function extractTextFromImage(imageUrl) {
  const result = await Tesseract.recognize(imageUrl, "eng", {
    logger: (m) => console.log(m),
  });

  return result.data.text;
}
