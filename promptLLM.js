const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

- For overtime 100% (code 1100): extract only from the quantity column (middle column). If the code is not found – do not return this field.
- For overtime 125% (1125): extract only from the quantity column. Do not return hourly rate or amount.
- For overtime 150% (1150): extract only from the quantity column. Do not return 0 unless the code truly does not exist.
- For hourly rate: extract only from the line with "004/". Ignore "002/" which is the daily rate.
- For base salary: extract only from the line with code "0002".
- For "גמול חיפוש" (1023): extract quantity only.
- For "פרמיה" (1210): extract value only (right column).
- For "כוננות" (1205): extract value only.
- For pension gross (165 or "165/"): extract the value if not related to vehicle or unclear labels.
- Do not extract “קה\"ש” (code 164) – skip even if present.
- Do not compute or extract salary additions (1000–5999) – skip these.
- For total gross: extract from line containing "ברוטו שוטף" or "סה\"כ ברוטו", but skip any line that includes the word "הפרשים".
- For total deductions: extract from the line "סה\"כ ניכויים" only.
- For net pay: extract from line "סה\"כ לתשלום", not from "קבוע נטו" or other net-related terms.
- For tax credit points: find in the monthly table under the current month (e.g., "נ. זיכוי" under "04").
- For seniority: extract only from the line containing "ותק מחושב". Do not extract from lines like "001 מינהלי".
- For rank: extract only the number that appears in the line starting with "דרגה:". For example, "דרגה: 17 14.05.2023" → return 17 only.
- All extracted values must be numbers only – no symbols (₪), no text, no units.
- If a value is missing – do not return 0 or null. Just omit the field.
- Return only keys from this list (in Hebrew):
  [
    "שעות נוספות 100%",
    "שעות נוספות 125%",
    "שעות נוספות 150%",
    "שכר יסוד",
    "סה\"כ ברוטו",
    "סה\"כ ניכויים",
    "נטו לתשלום",
    "ערך שעה",
    "ברוטו לפנסיה",
    "נקודות זיכוי",
    "גמול חיפוש",
    "פרמיה",
    "כוננות",
    "ותק",
    "דרגה"
  ]
- Output only valid JSON. Do not include comments or explanations.
`;

export default prompt;
