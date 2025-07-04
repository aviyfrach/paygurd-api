const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

GENERAL RULES:
- Payslip structures may vary. Do not assume a fixed layout, order, or presence of lines.
- Always match by component code (e.g., 1125), not by name alone.
- Extract only from lines that contain valid component codes.
- Use only the first appearance of a code – ignore duplicates.
- If a line contains more than 3 numeric values, treat it as invalid unless specifically matched by a rule.
- Skip any lines containing the words: "שונות", "גילום", "הפרשים", "רכב", "הבראה".
- All extracted values must be clean numbers (float), without ₪, commas, units, or spaces.
- If a value is missing or invalid – do not return 0 or null. Omit the field entirely.
- Do not return any English keys. Output keys must be in proper Hebrew only.

OVERTIME:
- For overtime 100% (code 1100):
  1. Locate the line with "1100" and extract the number exactly two numeric values after it – this is the quantity.
  2. If that fails and the line has exactly 3 numbers, return the middle one.
  3. If the line has 4 numeric values, reverse the order and take the 3rd number from the left – this is the quantity.
  4. If the extracted value is greater than 200, discard the field.

- For overtime 125% (code 1125):
  1. Locate the line with "1125" and extract the number exactly two numeric values after it – this is the quantity.
  2. If that fails and the line has exactly 3 numbers, return the middle one.
  3. If the line has 4 numeric values, reverse the order and take the 3rd number from the left – this is the quantity.
  4. If the extracted value is greater than 200, discard the field.

- For overtime 150% (code 1150):
  1. Locate the line with "1150".
  2. If the line has exactly 3 numeric values before the code – extract the third number from the right (this is the quantity).
  3. If the line has 4 numeric values – reverse the order and extract the 3rd from the left.
  4. If the extracted value is greater than 200, discard the field.

OTHER FIELDS:
- Hourly rate: extract only from the line with "004/". Ignore "002/".
- Base salary: extract only from the line with code "0002".
- "גמול חיפוש" (code 1023): extract quantity only.
- "פרמיה" (code 1210): extract value only.
- "כוננות" (code 1205): extract value only.
- Pension gross: extract only from line with code 165 or "165/", unless related to vehicle.
- Do not extract "קה\"ש" (code 164) – skip completely.
- Do not include salary additions (codes 1000–5999).
- Total gross: extract from "ברוטו שוטף" or "סה\"כ ברוטו". Skip if includes "הפרשים".
- Total deductions: extract from "סה\"כ ניכויים".
- Net pay: extract from "סה\"כ לתשלום". Ignore "קבוע נטו".
- Tax credit points: from row "נ. זיכוי" under correct month.
- Seniority: only from line with "ותק מחושב".
- Rank: only from "דרגה:" → extract numeric value.

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
