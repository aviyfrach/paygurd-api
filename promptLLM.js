const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

GENERAL RULES:
- Payslip structures may vary. Do not assume a fixed layout, order, or presence of lines.
- Always match by component code (e.g., 1125), not by name alone.
- Extract only from lines that contain valid component codes.
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
  2. If the line has 3 numeric values – return the middle value (this is the quantity).
  3. If the line has 4 numeric values – reverse the order and return the third from the left.
  4. Do not return values that are equal to the code itself (e.g., 1100).
  5. Do not return the hourly rate or the total value – only the quantity column.
  6. Discard values above 200.

- For overtime 125% (code 1125):
  1. Same rules as 1100: 3 values → middle, 4 values → third from left (after reverse).
  2. Never return 1125 as a value. Discard if matched.
  3. Quantity only. Do not return hourly rate or money value.
  4. Discard values above 200.

- For overtime 150% (code 1150):
  1. Locate the line with "1150".
  2. If 3 numeric values before the code – return the third from the right.
  3. If 4 values – reverse and return third from left.
  4. Discard values that equal 1150 or are above 200.

OTHER FIELDS:
- Hourly rate: extract only from the line that contains both "004/" and the phrase "ערך שעה". Do not extract from lines that contain only "ערך שעה" without "004/".
- Base salary: extract only from the line with code "0002".
- "גמול חיפוש" (code 1023): extract only the quantity number that appears on the same line as 1023. Never extract from unrelated lines like "ותק".
- "פרמיה" (code 1210): extract value only.
- "כוננות" (code 1205): extract value only.
- Pension gross: extract only from line with code 165 or "165/", unless related to vehicle.
- Do not extract "קה\"ש" (code 164) – skip completely.
- Do not include salary additions (codes 1000–5999).
- Total gross: extract from "ברוטו שוטף" or "סה\"כ ברוטו". Skip if includes "הפרשים".
- Total deductions: extract from "סה\"כ ניכויים".
- Net pay: extract from "סה\"כ לתשלום". Ignore "קבוע נטו".
- Tax credit points: locate the row titled "נ. זיכוי" under the relevant work month (e.g., 06 for June) and extract the number directly beneath that column only. Never extract a number that belongs to a different month or summary section.
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

