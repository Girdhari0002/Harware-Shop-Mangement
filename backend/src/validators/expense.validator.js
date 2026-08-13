export const validateExpense = (req) => {
  const errors = [];
  const { body } = req;
  const isCreate = req.method === "POST";
  if (isCreate) {
    if (!body.title || !String(body.title).trim()) errors.push("title: Title is required");
    if (typeof body.amount !== "number" || body.amount < 0) errors.push("amount: Amount must be a non-negative number");
  }
  if (body.category && !["rent", "salary", "transport", "utilities", "maintenance", "marketing", "misc"].includes(body.category)) errors.push("category: Invalid value");
  if (body.amount !== undefined && (typeof body.amount !== "number" || body.amount < 0)) errors.push("amount: Must be a non-negative number");
  return errors;
};
