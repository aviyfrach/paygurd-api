const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial values as a flat JSON with fixed Hebrew keys. The table is aligned right-to-left. Follow these strict rules:

🟩 GENERAL INSTRUCTIONS:
1. Only extract if the required code (e.g., 1100, 1125, 1150) appears in the same line as the value.
2. Do not infer or guess. If a field is missing or invalid – return value: 0.
3. All returned fields must have numeric values (float), without any currency, symbols, or text.
4. Do not return values from unrelated lines, summaries, headers or adjacent items.
5. Do not return the component code itself (e.g., 1100) as value.
6. If a field appears multiple times – extract only the first.
7. If the line contains more than 4 numeric values – discard it unless explicitly valid.
8. All field keys must be in Hebrew only.
9. All fields in the final output must be present – if a value is not found, return 0 for that key.
10. Never extract values that are equal to the code (e.g., 1100 as value).
11. Always validate the value is below 200 for any overtime quantity field.

🕒 שעות נוספות:
- שעות נוספות 100% (code 1100):
  - Line must contain "1100".
  - If line has 3 numbers → return middle.
  - If line has 4 → reverse and return third from left.
  - Must be numeric, < 200, and not a rate or total.
  - If not found – return 0.

- שעות נוספות 125% (code 1125):
  - Same logic: only from line with "1125".
  - Use same pattern (3 → middle, 4 → reversed third).
  - No guesswork – return 0 if invalid or not present.

- שעות נוספות 150% (code 1150):
  - Only from line with "1150".
  - Same extraction logic.
  - Value must be numeric, under 200.
  - If line includes "כוננות" or other components – discard.

🟨 ערך שעה:
- Extract only from line that includes both "004/" and "ערך שעה".
- Must not be from line with "002" or "ערך יום".
- If not found – return 0.

💰 שכר יסוד:
- Extract from line with code "0002".
- If not found – return 0.

📌 גמול חיפוש:
- Extract quantity from line containing code "1023".
- If not found – return 0.

📌 פרמיה:
- Extract value from code 1210.
- Only extract value column (not quantity).
- If missing – return 0.

📌 כוננות:
- Extract value from code 1205.
- If missing – return 0.

🏦 ברוטו לפנסיה:
- Extract from line containing code "165" or "165/".
- Do not extract if line contains רכב or הפקדה.
- If missing – return 0.

🛑 קה"ש:
- Do not extract קה"ש (164). Skip always.

🧮 סה"כ ברוטו:
- Extract from line containing "ברוטו שוטף" or "סה\"כ ברוטו".
- Skip if line contains "הפרשים".
- If not found – return 0.

🧾 סה"כ ניכויים:
- Extract from line "סה\"כ ניכויים" or matching 440/ line.
- If not found – return 0.

🟢 נטו לתשלום:
- From line with "סה\"כ לתשלום".
- Never use "קבוע נטו" or variants.
- If missing – return 0.

🎯 נקודות זיכוי:
- Look for row "נ. זיכוי" in monthly work table.
- Match to current month code (e.g., "06" for June).
- Extract value under that exact column.
- If month not matched or line missing – return 0.

📅 ותק:
- Extract only from line that includes the phrase "סך וותק מחושב".
- If not found – return 0.

🏅 דרגה:
- Extract from line starting with "דרגה:" or field named "דרגה".
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



