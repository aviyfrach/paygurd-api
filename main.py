from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import os
from openai import OpenAI

app = FastAPI()
openai_api_key = os.getenv("OPENAI_API_KEY")

PROMPT = """תשאיר אוכל — הפרומפט כל פעם ממשיך כאן"""

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
    messages = [{"role": "system", "content": PROMPT + text}]

    try:
        client = OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0,
        )
        return JSONResponse(content=response.choices[0].message.content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
