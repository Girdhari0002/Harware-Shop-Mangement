// 12-digit numeric code so it renders as a scannable UPC-A/EAN-13 barcode (see barcode.service.js).
let seq = 0;

export const generateEmployeeCode = () => {
  seq = (seq + 1) % 100;
  const time = Date.now().toString().slice(-9);
  const seqStr = String(seq).padStart(2, "0");
  return `9${time}${seqStr}`;
};
