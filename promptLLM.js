const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

GENERAL RULES:
- Payslip structures may vary. Do not assume a fixed layout, order, or presence of lines.
- Always match by component code (e.g., 1125), not by name alone.
- Extract only from lines that contain valid component codes.
- Never extract a value unless the code (e.g., 1100, 1125, 1150) appears in the same line.
- Do not return the component code itself (e.g., 1100) as a field value. Discard if that happens.
- Use only the first appearance of a code – ignore duplicates.
- If a line contains more than 3 numeric values, treat it as invalid unless specifically matched by a rule.
- Skip any lines containing the words: "שונות", "גילום", "הפרשים", "רכב", "הבראה".
- All extracted values must be clean numbers (float), without ₪, commas, units, or spaces.
- If a value is missing or invalid – do not return 0 or null. Omit the field entirely.
- Do not return any English keys. Output keys must be in proper Hebrew only.

OVERTIME:
- For overtime 100% (code 1100):
  1. Locate the line with "1100".
  2. If the line has 3 numeric values – return the middle value (quantity).
  3. If the line has 4 numeric values – reverse the order and return the third from the left.
  4. Do not return the hourly rate or total value – only the quantity.
  5. Do not return values that equal the code itself.
  6. Discard values above 200.

- For overtime 125% (code 1125):
  1. Same logic as 1100. Must be in same line as code.
  2. 3 values → take middle. 4 values → reverse and take third from left.
  3. Quantity only – never hourly rate or total value.
  4. Skip values over 200.

- For overtime 150% (code 1150):
  1. Must be on same line as 1150. Do not extract from nearby or next lines.
  2. If 3 values – take third from right. If 4 values – reverse and take third from left.
  3. Discard values that equal the code or are over 200.

OTHER FIELDS:
- Hourly rate: extract only from line that includes both "004/" and "ערך שעה".
- Base salary: from line with code "0002" only.
- "גמול חיפוש" (code 1023): extract quantity from the same line as code 1023. Never extract from unrelated fields like ותק.
- "פרמיה" (1210): extract value only.
- "כוננות" (1205): extract value only.
- Pension gross: extract from code 165 or "165/", unless related to רכב.
- Do not extract קה"ש (code 164).
- Do not include additions (codes 1000–5999).
- Gross total: from line "ברוטו שוטף" or "סה\"כ ברוטו", but skip if includes "הפרשים".
- Deductions: from "סה\"כ ניכויים".
- Net: from "סה\"כ לתשלום", not "קבוע נטו".
- Tax credit points ("נקודות זיכוי"):
  1. Locate row with "נ. זיכוי" in the table of months.
  2. Identify the column matching the current work month (e.g., "06").
  3. Extract the number directly under that column only. Do not take from totals or wrong month.
- Seniority: extract only from "ותק מחושב".
- Rank: only from "דרגה:" (e.g., "דרגה: 18") – extract the number only.

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

- Output must be valid flat JSON only. Do not include comments, explanations, or any surrounding text.
`;

export default prompt;

