const prompt = `
The following text is a Hebrew payslip. Extract the values of the following fields according to these strict instructions. The table is right-to-left aligned:

1. For all overtime fields (1100, 1125, 1150) – extract only the number in the quantity column. It is the middle column: description | quantity | value.
2. Example: for 1125 overtime, if the line reads: 2,552.67 | 67.71 | 37.70 – extract 37.70.
3. Never use the hourly rate or the amount column – only extract from the quantity column.
4. Overtime 100% – code 1100 only. Extract quantity if the code exists. Otherwise, ignore completely.
5. Overtime 125% – code 1125 only. Extract quantity only (e.g., 37.70).
6. Overtime 150% – code 1150 only. Extract quantity only (e.g., 41.50).
7. Hourly rate – extract only from the line containing code "004/". For example: "004/54.17 ערך שעה" → hourly rate is 54.17.
8. Base salary – extract only from the line with code "0002".
9. Salary additions – sum the values of all components with codes between 1000–5999, excluding 0002 and overtime codes.
10. "גמול חיפוש" – code 1023. Extract the quantity only.
11. "פרמיה" – code 1210. Extract the value only (right column).
12. "כוננות" – code 1205. Extract the value only.
13. Gross for pension – code 165 or any line starting with "165/". Extract the adjacent number.
14. Keren Hishtalmut (קופת השתלמות, "קה\"ש") – extract from line with code 164.
15. Total gross – find the line containing "ברוטו שוטף" or "סה\"כ ברוטו" and extract the number.
16. Total deductions – extract only from the line with "סה\"כ ניכויים".
17. Net pay – extract only from the line with "סה\"כ לתשלום". Do not include "קבוע נטו".
18. Tax credit points – look inside the monthly table. Locate the relevant month (e.g., 04) and extract the value underneath "נ. זיכוי".
19. Seniority – extract only from the line containing "ותק מחושב".
20. Rank – extract from the field labeled "דרגה" only.
21. If a component has only a monetary value and no quantity – do not return that field.
22. All overtime values must be less than 200.
23. All monetary values must be positive numeric values only.
24. Do not return any fields if the code does not appear in the text.
25. Ignore components such as 46T, זקיפות, refunds, or commissions.
26. Do not include gross values from lines labeled "הפרשים".
27. Do not include gross lines related to travel, vacation, or vehicle.
28. Output must be a flat JSON object: key:value pairs only.
29. All keys must be in Hebrew only, e.g., "שעות נוספות 125%", "שכר יסוד", "קה\"ש".
30. Output must be enclosed in curly braces only.
31. Never use ranges like 1100–1125 – use exact codes only.
32. For overtime – make sure the code appears on the same line as the value. If it’s missing, skip the field.
33. If a component appears more than once – take only the first instance.
34. Do not extract components related to "הבראה".
35. Do not extract components that have no code at all.
36. If a number has a currency symbol (₪) or hourly notation – ignore it unless defined otherwise.
37. For missing components – do not return an empty or null value. Just omit the key.
38. Ensure all values are numeric – no symbols, no text.
39. Do not return explanations, comments, or free text.
40. Only use the following keys in the output: "שעות נוספות 100%", "שעות נוספות 125%", "שעות נוספות 150%", "שכר יסוד", "תוספות שכר", "סה\"כ ברוטו", "סה\"כ ניכויים", "נטו לתשלום", "ערך שעה", "קה\"ש", "ברוטו לפנסיה", "נקודות זיכוי", "גמול חיפוש", "פרמיה", "כוננות", "ותק", "דרגה".
41. Gross for pension – do not include if it appears in vehicle or unclear fields.
42. If you cannot confidently identify a field – skip it.
43. Do not include keys with parentheses, hyphens, or non-standard labels.
44. Do not repeat values – each key appears only once.
45. If uncertain about a value – do not include it at all.
46. Output must be ready for machine parsing – no interpretation required.
47. Do not use abbreviations or short names.
48. All keys must be in fully spelled-out, proper Hebrew.
49. Do not return text like "not found", "error", or "unrecognized".
50. Output must be strict JSON. Any deviation will be rejected.
`;

export default prompt;
