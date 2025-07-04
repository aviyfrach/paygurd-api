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
10. Do not extract from rows that contain נסיעות, רכב, הבראה, זקיפות or unclear labels.
11. Never extract negative values.
12. All field keys must be in Hebrew only.
13. All fields in the final output must be present – if a value is not found, return 0 for that key.
14. Never extract values that are equal to the code itself (e.g., 1100 as value).
15. All values must be rounded to two decimal places.
16. All numeric fields must be valid positive numbers under 200 (for quantities).

🕒 שעות נוספות:
- שעות נוספות 100% (code 1100):
  - חובה שהשורה תכיל את הקוד "1100".
  - פסול שורה אם היא מכילה את המילים "הפרש", "הפרשים", טווח תאריכים, או מילים כמו "כוננות", "משמרת".
  - אם בשורה יש 3 ערכים מספריים – קח את האמצעי **רק אם הוא בין 1 ל־200**.
  - אם בשורה יש 4 ערכים – הפוך את הסדר וקח את השלישי משמאל **רק אם הוא קטן מ־200**.
  - אל תיקח ערך שהוא סכום כולל או ערך לשעה (למשל 51.55).
  - אל תיקח ערך הזהה לערך השעה שמופיע בשדה "ערך שעה".
  - אם לא עומד בתנאים – החזר 0.

- שעות נוספות 125% (code 1125):
  - אותו כלל בדיוק כמו 1100.
  - ודא שהקוד מופיע באותה שורה.
  - קח את הערך האמצעי **רק אם הוא נראה כמו כמות שעות (1–200)**.
  - אל תיקח סכומים, סכומים לשעה או ערכים דומים ל־"ערך שעה".
  - פסול שורות עם יותר מ־4 ערכים או מבנה שגוי.

- שעות נוספות 150% (code 1150):
  - אותו כלל בדיוק כמו 125%.
  - אל תיקח ערך אם הוא שווה לסכום כספי או לסכום נטו של רכיב.
  - הקפד להחזיר אך ורק את כמות השעות (לדוגמה 47.55), לא את הערך הכספי (למשל 2,652.27).
  - אם לא נמצא ערך מתאים – החזר 0.

🟨 ערך שעה:
- חפש שורה שמכילה גם את המילה "004" וגם את הביטוי "ערך שעה".
- מותר שהשורה תהיה בטבלת נתוני עזר, גם אם לא בטבלת השכר הראשית.
- אסור שהשורה תכלול "002" או "ערך יום".
- הערך חייב להיות מספר בין 30 ל־200.
- קח את השורה התקפה הראשונה בלבד.
- אם לא נמצא ערך תקף – החזר 0.

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
- Match the value in the column with the exact month number (e.g., "04" for April).
- Value must be numeric and between 0–12.
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







