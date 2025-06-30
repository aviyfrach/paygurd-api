from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import openai
import os

app = FastAPI()
openai.api_key = os.getenv("OPENAI_API_KEY")

PROMPT = \"\"\"
אתה פועל כמודול חילוץ נתונים חכם מתוך תלושי שכר בפורמט טקסטואלי (עברית), מתוך מסמכי PDF ציבוריים. המשימה שלך היא לחלץ אך ורק את המידע המדויק, לפי ההנחיות הבאות, ולבנות פלט בפורמט JSON. אל תכלול מידע נוסף, אל תעגל ערכים, ואל תפרש שדות שלא התבקשת לגביהם. אל תכלול טקסט הסברתי, רק JSON.

(כאן ממשיך כל הפרומפט – תוכל להשאיר אותו פתוח לשלב הבא או להכניס חלקית)

\"\"\"
def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

@app.post("/extract-payslip")
async def extract_payslip(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    path = f"/tmp/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())
    text = extract_text_from_pdf(path)
    messages = [{"role": "system", "content": PROMPT}, {"role": "user", "content": text}]
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            temperature=0,
            response_format="json"
        )
        return JSONResponse(content=response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
