export const validatePayment = (req) => {
  const errors = [];
  const { body } = req;
  const isCreate = req.method === "POST";
  if (isCreate) {
    if (!body.partyType || !["customer", "supplier"].includes(body.partyType)) errors.push("partyType: Must be 'customer' or 'supplier'");
    if (typeof body.amount !== "number" || body.amount <= 0) errors.push("amount: Amount must be a positive number");
  }
  if (body.paymentMethod && !["cash", "upi", "bank", "cheque", "credit"].includes(body.paymentMethod)) errors.push("paymentMethod: Invalid value");
  if (body.status && !["pending", "cleared", "bounced"].includes(body.status)) errors.push("status: Invalid value");
  return errors;
};
