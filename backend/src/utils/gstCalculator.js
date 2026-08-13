export const calculateGstAmounts = ({ taxableAmount = 0, gstRate = 18, interstate = false }) => {
  const gstAmount = (Number(taxableAmount) * Number(gstRate)) / 100;
  if (interstate) {
    return { cgst: 0, sgst: 0, igst: gstAmount, total: Number(taxableAmount) + gstAmount };
  }
  return { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0, total: Number(taxableAmount) + gstAmount };
};