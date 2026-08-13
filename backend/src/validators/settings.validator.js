export const validateSettings = (req) => {
  const errors = [];
  const { body } = req;
  const path = req.path || "";
  if (path.includes("/company")) {
    if (body && body.company && body.company.name !== undefined && !String(body.company.name).trim()) errors.push("company.name: Company name is required");
    if (body && body.gstNumber !== undefined && typeof body.gstNumber !== "string") errors.push("gstNumber: Must be a string");
    return errors;
  }
  const isCreate = req.method === "POST";
  if (isCreate) {
    if (!body.fullName || !String(body.fullName).trim()) errors.push("fullName: Full name is required");
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("email: A valid email is required");
    if (!body.password || body.password.length < 6) errors.push("password: Password must be at least 6 characters");
  } else {
    if (body.fullName !== undefined && !String(body.fullName).trim()) errors.push("fullName: Full name is required");
    if (body.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("email: A valid email is required");
  }
  if (body.role !== undefined && !["admin", "staff"].includes(body.role)) errors.push("role: Must be 'admin' or 'staff'");
  return errors;
};
