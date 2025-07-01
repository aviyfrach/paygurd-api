# Paygurd API – עיבוד תלושי שכר עם OCR ו־GPT

API חכם שמקבל קובץ תמונה של תלוש שכר (או PDF), מפענח אותו עם OCR, שולח ל־OpenAI GPT, ומחזיר JSON עם נתונים מדויקים מהתלוש.

---

## 🚀 פריסה מהירה ל־Render

לחץ כאן כדי לפרוס את ה־API בלחיצה:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Aviyfrach/paygurd-api)

---

## 🔧 מה ה־API עושה?

- מזהה טקסט מתמונה (OCR)
- שולח את הטקסט ל־GPT עם פרומפט מותאם
- מחלץ נתונים כמו:
  - ברוטו, נטו
  - שעות נוספות (100%, 125%, 150%)
  - ערך שעה
  - כוננויות, פרמיה, קצובת כלכלה

---

## 📥 נתוני קלט

```json
POST /processPayslipFromOCR

{
  "fileUrl": "https://your-payslip-url"
}
