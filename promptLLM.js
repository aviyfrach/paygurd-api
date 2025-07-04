const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial values as a flat JSON with fixed Hebrew keys. The table is aligned right-to-left. Follow these strict rules:

🟩 GENERAL INSTRUCTIONS:
1. Only extract if the required code (e.g., 1100, 1125, 1150) appears in the same line as the value.
2. Do not infer or guess. If a field is missing or invalid – return value: 0.
3. All returned fields must have numeric values (float), without any currency, symbols, or text.
4. Do not return values from unrelated lines, summaries, headers or adjacent items.
5. Do not return the component code itself (e.g., 1100) as value.
6. If a field appears multiple times – extract only the first valid line that is not part of a "הפרש" or adjustment section.
7. Completely ignore any line that includes the word "הפרש" or "הפרשים".
8. Ignore lines that contain a date range, such as "01.25–04.25".
9. If the line contains more than 4 numeric values – discard it unless explicitly valid.
10. All field keys must be in Hebrew only.
11. All fields in the final output must be present – if a value is not found, return 0 for that key.
12. Never extract values that are equal to the code (e.g., 1100 as value).
13. Always validate the value is below 200 for any overtime quantity field.
14. Do not extract from rows that contain נסיעות, רכב, הבראה, זקיפות or unclear labels.
15. Each key must appear only once, and always with a numeric value.
16. Round all numbers to two decimal places.

🕒 שעות נוספות:
- שעות נוספות 100% (code 1100):
  - Must appear in same line as value.
  - Line must contain 3 or 4 numeric values.
  - If 3 values → return the middle.
  - If 4 values → reverse line and return third from left.
  - Value must be < 200, not a rate, not from "הפרשים" or with date range.
  - If not found – return 0.

- שעות נוספות 125% (code 1125):
  - Same logic as above with code 1125.
  - First valid non-adjustment line only.
  - If not found – return 0.

- שעות נוספות 150% (code 1150):
  - Same logic as above with code 1150.
  - If multiple 1150 lines found, take only the first valid non-adjustment one.
  - If not found – return 0.

🟨 ערך שעה:
- Look for any row (even if values are separated by tabs or spaces) that contains both:
  - The code "004" (with or without slash, e.g., "004", "004/")
  - The phrase "ערך שעה"
- These can appear in the same line, in adjacent columns, or even as a combined string like: "004/51.55 ערך שעה".
- From that row or combined string, extract the only numeric value between 30–200 that is not the code itself.
- Do not extract if the line also contains "002" or "ערך יום".
- Use only the first valid match.
- If not found – return 0.

💰 שכר יסוד:
- Extract from line with code "0002".
- If not found – return 0.

📌 גמול חיפוש:
- Extract quantity from line containing code "1023".
- Must not be from adjustment section.
- If not found – return 0.

📌 פרמיה:
- Extract value from code 1210.
- Only the value column.
- If missing – return 0.

📌 כוננות:
- Extract value from code 1205.
- Only the value column.
- If missing – return 0.

🏦 ברוטו לפנסיה:
- Extract from line with code "165" or starting with "165/".
- Skip if line contains רכב, נסיעות, הבראה, or הפקדה.
- Must be numeric.
- If missing – return 0.

🛑 קה"ש:
- Always skip קה"ש (164).

🧮 סה"כ ברוטו:
- Extract from line containing "ברוטו שוטף" or "סה\"כ ברוטו".
- Skip if line contains "הפרש" or "הפרשים".
- Must be a positive number.
- If not found – return 0.

🧾 סה"כ ניכויים:
- Extract from line with "סה\"כ ניכויים" or line with code 440/.
- Must be numeric.
- If not found – return 0.

🟢 נטו לתשלום:
- From line with "סה\"כ לתשלום".
- Never use "קבוע נטו" or variations.
- If not found – return 0.

🎯 נקודות זיכוי:
- Locate the row "נ. זיכוי" in the monthly summary table.
- Match value under column matching current month number (e.g., "04" for April).
- Value must be numeric between 0–12.
- If not found – return 0.

📅 ותק:
- Extract only from line containing exact phrase "סך וותק מחושב".
- Ignore any other "ותק".
- If not found – return 0.

🏅 דרגה:
- Extract from line starting with "דרגה:" or containing label "דרגה".
- Must be numeric only.
- If missing – return 0.

📤 FINAL OUTPUT FORMAT:
Return all fields below, even if their value is 0:

{
  "שעות נוספות 100%": number,
  "שעות נוספות 125%": number,
  "שעות נוספות 150%": number,
  "שכר יסוד": number,
  "סה\"כ ברוטו": number,
  "סה\"כ ניכויים": number,
  "נטו לתשלום": number,
  "ערך שעה": number,
  "ברוטו לפנסיה": number,
  "נקודות זיכוי": number,
  "גמול חיפוש": number,
  "פרמיה": number,
  "כוננות": number,
  "ותק": number,
  "דרגה": number
}

The response must be valid JSON with no explanations, no formatting issues, and no text outside the object.
`;

export default prompt;








