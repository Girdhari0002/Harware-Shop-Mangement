const isValidId = (v) => v && /^[0-9a-fA-F]{24}$/.test(v);

export const validateSale = (req) => {
  const errors = [];
  const { body } = req;
  const isCreate = req.method === "POST";
  if (isCreate) {
    if (!Array.isArray(body.items) || body.items.length === 0) errors.push("items: At least one line item is required");
  }
  if (Array.isArray(body.items)) {
    body.items.forEach((item, i) => {
      if (!item.productName && !item.product) errors.push(`items[${i}].productName: Product name is required`);
      if (typeof item.qty !== "number" || item.qty <= 0) errors.push(`items[${i}].qty: Quantity must be a positive number`);
      if (typeof item.price !== "number" || item.price < 0) errors.push(`items[${i}].price: Price must be a non-negative number`);
    });
  }
  if (body.customer && body.customer !== null && !isValidId(body.customer)) errors.push("customer: Invalid customer id");
  if (body.paymentStatus && !["pending", "partial", "paid"].includes(body.paymentStatus)) errors.push("paymentStatus: Invalid value");
  return errors;
};
