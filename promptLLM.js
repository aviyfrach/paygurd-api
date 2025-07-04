const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

GENERAL RULES:
- Payslip structures may vary. Do not assume a fixed layout, order, or presence of lines.
- Extract only if the required code (e.g., 1100, 1125, 1150) appears in the same line as the value.
- Never extract values from adjacent or unrelated lines.
- Never extract the component code itself as a value (e.g., do not return 1100).
- Use only the first appearance of each code. Ignore duplicates.
- Skip any line with more than 4 numeric values unless explicitly required.
- Skip any line containing "שונות", "גילום", "הפרשים", "רכב", "הבראה".
- All values must be numeric only (float) without ₪, symbols, or units.
- Do not return 0 or null for missing fields. Omit them completely.
- All keys must be in correct Hebrew only. No English or abbreviations.

OVERTIME (שעות נוספות):
- For 100% (code 1100):
  1. Line must contain "1100".
  2. If line has 3 numbers → return the middle one.
  3. If line has 4 numbers → reverse order and return third from the left.
  4. Value must be a quantity (not hourly rate or total).
  5. Value must be under 200.

- For 125% (code 1125):
  1. Line must contain "1125".
  2. Use same rules as above (3 → middle, 4 → third from left reversed).
  3. Do not extract rate or total. Only quantity.
  4. Must be < 200.

- For 150% (code 1150):
  1. Must be in same line as "1150".
  2. Same logic for choosing value.
  3. Never extract value if code is missing in that line.
  4. Skip if value = 1150 or > 200.

OTHER FIELDS:
- Hourly rate: extract only from line that contains both "004/" and "ערך שעה".
- Base salary: from line with code "0002" only.
- "גמול חיפוש" (1023): extract quantity only from line containing "1023". Do not use other lines.
- "פרמיה" (1210): extract value only.
- "כוננות" (1205): extract value only.
- Pension gross (165): extract from line with 165 only. Skip if related to רכב.
- Do not extract קה"ש (164).
- Do not include additions (codes 1000–5999).
- Gross total: from "ברוטו שוטף" or "סה\"כ ברוטו" only. Skip if line includes "הפרשים".
- Deductions: from "סה\"כ ניכויים" only.
- Net pay: from "סה\"כ לתשלום", not "קבוע נטו".
- Tax credit points ("נקודות זיכוי"):
  1. Find row "נ. זיכוי" in monthly table.
  2. Find the column matching the work month (e.g., "06" for June).
  3. Extract the value under that exact column only. Never take from summary or wrong month.
- Seniority ("ותק"): only from line containing "ותק מחושב".
- Rank ("דרגה"): from line starting with "דרגה:" → extract number only.

OUTPUT:
Return only the following keys (in Hebrew):

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

- Output must be valid flat JSON. Do not include explanations or any text outside the JSON.
`;

export default prompt;



