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
