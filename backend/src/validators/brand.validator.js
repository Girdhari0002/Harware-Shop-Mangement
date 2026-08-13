export const validateBrand = (req) => {
  const errors = [];
  const { body } = req;
  if (body && body.name !== undefined && !String(body.name).trim()) errors.push("name: Name is required");
  if (body && body.isActivated !== undefined && typeof body.isActivated !== "boolean") errors.push("isActive: Must be a boolean");
  return errors;
};
