export const validateCustomer = (req) => {
  const errors = [];
  const { body } = req;
  if (body && !body.name?.trim?.()) errors.push("name: Name is required");
  if (body && body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("email: A valid email is required");
  if (body && body.gstType && !["regular", "composition", "unregistered", "sez", "overseas"].includes(body.gstType)) errors.push("gstType: Invalid value");
  return errors;
};
