const prompt = `
You will receive a Hebrew payslip as plain text. Your task is to extract specific financial and employment-related values according to the following instructions. The table is aligned right-to-left. Return only a flat JSON with specific Hebrew keys. Follow the rules strictly.

- For overtime 100% (code 1100): extract only from the quantity column. If code is not present – skip.
- For overtime 125% (1125): extract quantity only. Do not use amount or hourly rate.
- For overtime 150% (1150): extract quantity only.
- For hourly rate: extract only from line with "004/". Ignore "002/" (daily rate).
- For base salary: extract only from code "0002".
- For "גמול חיפוש" (1023): extract quantity only.
- For "פרמיה" (1210) and "כוננות" (1205): extract value only.
- For pension gross (165 or 165/): extract value only, unless it's part of a vehicle or unclear line.
- For total gross: extract only from line containing "ברוטו שוטף" or "סה\"כ ברוטו". Exclude lines with "הפרשים".
- For total deductions: extract only from line "סה\"כ ניכויים".
- For net pay: extract only from line "סה\"כ לתשלום". Do not use "קבוע נטו".
- For tax credit points: locate the monthly table and extract the value below the active month in row "נ. זיכוי".
- For seniority: extract only from line containing "ותק מחושב". Do not extract rank values like "001 מינהלי".
- For rank: extract only from the field labeled "דרגה".
- Do not extract or compute any salary additions (codes 1000–5999). Ignore this range completely.
- Do not extract "קה\"ש" (code 164) even if present.
- All returned values must be numeric only – no symbols (₪), no text, no formatting.
- Do not return 0, null, or any default if a component is missing. Just omit the key.
- Only extract components that actually appear in the payslip text.
- Return a flat JSON object with Hebrew keys, like:
  {
    "שעות נוספות 100%": 0,
    "שעות נוספות 125%": 37.7,
    "שעות נוספות 150%": 41.5,
    "שכר יסוד": 2633.58,
    "ערך שעה": 54.17,
    "ברוטו לפנסיה": 9389.6,
    "סה\"כ ברוטו": 24902.01,
    "סה\"כ ניכויים": 7471.97,
    "נטו לתשלום": 17090.84,
    "גמול חיפוש": 2,
    "פרמיה": 2506.45,
    "כוננות": 1732.36,
    "נקודות זיכוי": 8.25,
    "ותק": 9.06,
    "דרגה": "001 מינהלי"
  }

Do not return explanations or comments. Output only a valid JSON object with keys from the approved list.
`;
export default prompt;
