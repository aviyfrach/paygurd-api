export const payslipPrompt = `
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
- בטבלת "עבודה נוספת" כל שורה בנויה מ־5 טורים מימין לשמאל:
  [קוד + תיאור] [כמות שעות] [ערך ליחידה] [סכום] [סה"כ]
- עבור כל אחד מהקודים (100% = 1100, 125% = 1125, 150% = 1150):
  - אתר את השורה שמכילה את הקוד במפורש.
  - שלוף אך ורק את **הטור השני מימין**, שהוא טור **כמות השעות**.
  - אל תשתמש בערכים אחרים מהשורה – גם אם הם קטנים מ־200.
  - אל תשתמש בשורה אם היא כוללת "הפרש" או טווח תאריכים.
  - עבור כל קוד – שלוף את ההתאמה הראשונה התקפה בלבד.
  - אם לא נמצאה התאמה – החזר 0.

🟨 ערך שעה:
- חפש שורה המכילה גם את הקוד "004" (עם או בלי סלאש, למשל "004", "004/") וגם את הביטוי "ערך שעה".
- ייתכן שהשורה תופיע כמחרוזת משולבת כמו "004/51.55 ערך שעה".
- אם הקוד והערך מופיעים יחד (למשל "004/51.55"), שלוף את המספר שמופיע אחרי הסלאש בלבד.
- ניתן גם לשלוף אם הקוד והערך מופיעים בעמודות נפרדות באותה שורה.
- אל תחלץ את הערך אם השורה מכילה גם את הקוד "002" או את הביטוי "ערך יום".
- המספר שייחלץ חייב להיות בטווח 30–200, ולא להיות זהה לקוד "004".
- השתמש רק בהתאמה התקפה הראשונה.
- אם לא נמצאה התאמה – החזר 0.

💰 שכר יסוד:
- Extract from line with code "0002".
- If not found – return 0.

📌 גמול חיפוש:
- שלוף את כמות השעות מתוך השורה שמכילה את הקוד "1023".
- אסור לשלוף משורה שכוללת את המילה "הפרש" או "הפרשים".
- אם הקוד מופיע יותר מפעם אחת – קח רק את ההתאמה הראשונה התקפה.
- אם לא נמצאה התאמה – החזר 0.

📌 פרמיה:
- שלוף את הערך מהשורה עם הקוד "1210".
- שלוף אך ורק מהטור השני מימין (כמות).
- אל תשתמש בערך ליחידה או סכום.
- אם לא נמצאה התאמה חוקית – החזר 0.

📌 כוננות:
- שלוף את הערך מהשורה עם הקוד "1205".
- שלוף אך ורק מהטור השני מימין (כמות שעות).
- אם לא נמצאה התאמה – החזר 0.

🏦 ברוטו לפנסיה:
- שלוף מהשורה שמכילה את הקוד "165" או שמתחילה ב־"165/".
- אסור שהשורה תכיל מילים כמו רכב, נסיעות, הבראה, הפקדה.
- הערך חייב להיות מספר חוקי.
- אם לא נמצאה התאמה חוקית – החזר 0.

🛑 קה"ש:
- Always skip קה"ש (164).

🧮 סה"כ ברוטו:
- שלוף את הערך מהשורה המכילה את הביטוי "ברוטו שוטף" או "סה\"כ ברוטו".
- אסור שהשורה תכיל את המילים "הפרש" או "הפרשים".
- הערך חייב להיות מספר חיובי – ללא תווים נוספים.
- אם לא נמצאה התאמה חוקית – החזר 0.

🧾 סה"כ ניכויים:
- שלוף מהשורה המכילה את הביטוי "סה\"כ ניכויים" או מהשורה עם הקוד "440/".
- אל תשתמש בשורות המכילות את המילה "הפרש".
- הערך חייב להיות מספר חוקי.
- אם לא נמצאה התאמה – החזר 0.

🟢 נטו לתשלום:
- שלוף מהשורה שמכילה את הביטוי "סה\"כ לתשלום".
- אל תשתמש בשורות שכוללות "קבוע נטו", "ברוטו נטו" או גרסאות דומות.
- הערך חייב להיות מספר חוקי, ללא תווים.
- אם לא נמצאה התאמה – החזר 0.

🎯 נקודות זיכוי:
- אתר את שורת "נ. זיכוי" בטבלת חודשי העבודה.
- שלוף את הערך שמתאים לעמודה של מספר החודש הנוכחי (למשל "04" עבור אפריל).
- הערך חייב להיות מספר בטווח 0–12.
- אם אין התאמה – החזר 0.

📅 ותק:
- שלוף רק מהשורה שמכילה את הביטוי המדויק "סך וותק מחושב".
- אל תשתמש באף שורה אחרת שמכילה את המילה "ותק".
- אם לא נמצאה התאמה – החזר 0.

🏅 דרגה:
- אתר את השורה המכילה את המילה "דרגה:" בטבלת הנתונים האישיים.
- השורה מכילה שלושה טורים: [כותרת] [טור אמצעי – ערך הדרגה] [טור שמאלי – תאריך].
- שלוף אך ורק את הערך מהטור האמצעי (לדוגמה: אם כתוב "דרגה: 17 14.05.2023" → יש להחזיר 17).
- הערך חייב להיות מספר חוקי.
- אם לא נמצאה התאמה – החזר 0.

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
export const payslipPrompt = prompt;

