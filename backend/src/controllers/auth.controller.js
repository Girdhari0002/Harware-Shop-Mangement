import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";

export const registerAuth = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, message: "Full name, email and password are required." });
  }

  const { message, user, accessToken, refreshToken } = await authService.register(req.body);
  return res.status(201).json({ success: true, message, data: { user, accessToken, refreshToken } });
});

export const loginAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const { message, user, accessToken, refreshToken } = await authService.login(req.body);
  return res.status(200).json({ success: true, message, data: { user, accessToken, refreshToken } });
});

export const logoutAuth = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Logout successful" });
});

export const forgotPasswordAuth = asyncHandler(async (req, res) => {
  const { message, data } = await authService.forgotPassword(req.body);
  res.status(200).json({ success: true, message, data });
});

export const changePasswordAuth = asyncHandler(async (req, res) => {
  const { message } = await authService.changePassword(req.body, req.user?.id);
  res.status(200).json({ success: true, message });
});

// Return current authenticated user (sanitized)
export const meAuth = asyncHandler(async (req, res) => {
  // authenticate middleware ensures req.user is loaded from DB
  const user = req.user;
  if (!user) return res.status(401).json({ success: false, message: "Not authenticated" });
  return res.json({ success: true, data: user });
});
