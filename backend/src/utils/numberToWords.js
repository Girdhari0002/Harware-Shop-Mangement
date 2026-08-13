const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const twoDigits = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : ""));

const threeDigits = (n) => {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  return (hundred ? ONES[hundred] + " Hundred" + (rest ? " " : "") : "") + (rest ? twoDigits(rest) : "");
};

// Indian numbering system (Crore / Lakh / Thousand), e.g. 975 -> "Nine Hundred Seventy Five"
const integerToWords = (value) => {
  let n = Math.trunc(value);
  if (n === 0) return "Zero";
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;
  const parts = [];
  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh) parts.push(threeDigits(lakh) + " Lakh");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (hundred) parts.push(threeDigits(hundred));
  return parts.join(" ");
};

export const numberToWords = (amount) => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "Zero only";
  const value = Math.abs(Number(amount));
  const rupees = Math.floor(value);
  const paise = Math.round((value - rupees) * 100);
  let words = integerToWords(rupees);
  if (paise > 0) words += " and " + integerToWords(paise) + " Paise";
  return (Number(amount) < 0 ? "Minus " : "") + words + " only";
};
