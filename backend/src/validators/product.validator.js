const REQUIRED = ["name"];

export const validateProduct = (req) => {
  const errors = [];
  const { body } = req;
  const isCreate = req.method === "POST";
  for (const field of REQUIRED) {
    if (isCreate && !(body && body[field] !== undefined && body[field] !== null && String(body[field]).trim() !== "")) {
      errors.push(`${field}: ${field} is required`);
    }
  }
  if (body) {
    if (body.gstPercent !== undefined && (typeof body.gstPercent !== "number" || body.gstPercent < 0 || body.gstPercent > 100)) errors.push("gstPercent: Must be a number between 0 and 100");
    if (body.buyPrice !== undefined && (typeof body.buyPrice !== "number" || body.buyPrice < 0)) errors.push("buyPrice: Must be a non-negative number");
    if (body.sellPrice !== undefined && (typeof body.sellPrice !== "number" || body.sellPrice < 0)) errors.push("sellPrice: Must be a non-negative number");
    if (body.quantity !== undefined && (typeof body.quantity !== "number" || body.quantity < 0)) errors.push("quantity: Must be a non-negative number");
    if (body.unit && !["pcs", "kg", "m", "sqft", "sheet", "box", "ltr"].includes(body.unit)) errors.push("unit: Invalid value");
    if (body.status && !["active", "inactive"].includes(body.status)) errors.push("status: Invalid value");
  }
  return errors;
};
