const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

- Payslip structures may vary. Do not assume the layout, order, or presence of specific lines. Always rely on the component code or key phrase itself, not position.
- For overtime 100% (code 1100): extract only from the quantity column (middle column). If the code is not found – do not return this field.
- For overtime 125% (code 1125): find the line that contains "1125" and extract the third number from the right (e.g., סכום | ערך לשעה | כמות). That number is the quantity. Ignore all other values.
- For overtime 150% (code 1150): extract only from the quantity column. Do not return 0 unless the code truly does not exist.
- For hourly rate: extract only from the line with "004/". Ignore "002/" which is the daily rate.
- For base salary: extract only from the line with code "0002".
- For "גמול חיפוש" (code 1023): extract quantity only.
- For "פרמיה" (code 1210): extract value only (right column).
- For "כוננות" (code 1205): extract value only.
- For pension gross (code 165 or line starting with "165/"): extract the value only if not related to vehicle or unclear labels.
- Do not extract or include "קה\"ש" (code 164) – skip even if present.
- Do not compute or include salary additions (codes 1000–5999) – skip completely.
- For total gross: extract from line containing "ברוטו שוטף" or "סה\"כ ברוטו", but skip any line that includes the word "הפרשים".
- For total deductions: extract only from the line "סה\"כ ניכויים".
- For net pay: extract only from the line "סה\"כ לתשלום". Do not use values like "קבוע נטו".
- For tax credit points: extract from the "נ. זיכוי" row under the relevant month column (e.g., "04").
- For seniority: extract only from the line that includes the exact phrase "ותק מחושב". Do not confuse with grade or job titles.
- For rank: extract only the number from the line starting with "דרגה:". For example, "דרגה: 17 14.05.2023" → return 17 only.
- All extracted values must be numbers only – no symbols (e.g., ₪), no units, no text.
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

- Output must be valid flat JSON only. Do not include comments, explanations, or any surrounding text.
`;

export default prompt;
