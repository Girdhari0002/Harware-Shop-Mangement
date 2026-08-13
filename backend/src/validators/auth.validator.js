export const validateAuth = (req) => {
  const errors = [];
  const { path, body } = req;

  const email = (body && body.email) || "";
  const password = (body && body.password) || "";

  if (path.includes("/register")) {
    if (!body.fullName || !body.fullName.trim()) errors.push("fullName: Full name is required");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email: A valid email is required");
    if (!password || password.length < 6) errors.push("password: Password must be at least 6 characters");
    if (body.role && !["admin", "staff"].includes(body.role)) errors.push("role: Must be 'admin' or 'staff'");
  }

  if (path.includes("/login")) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email: A valid email is required");
    if (!password) errors.push("password: Password is required");
  }

  if (path.includes("/forgot-password")) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email: A valid email is required");
  }

  if (path.includes("/change-password")) {
    if (!body.currentPassword) errors.push("currentPassword: Current password is required");
    if (!body.newPassword || body.newPassword.length < 6) errors.push("newPassword: New password must be at least 6 characters");
    if (body.newPassword && body.newPassword !== body.confirmPassword) errors.push("confirmPassword: New password confirmation does not match");
  }

  return errors;
};
