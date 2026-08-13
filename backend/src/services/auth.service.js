import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { env } from "../config/env.js";

const sanitize = (u) => ({ _id: u._id, id: u.id, fullName: u.fullName, email: u.email, role: u.role, isActive: u.isActive, createdAt: u.createdAt, updatedAt: u.updatedAt });

const tokensForUser = (user) => ({
  user: sanitize(user),
  accessToken: generateAccessToken({ sub: user._id || user.id, role: user.role }),
  refreshToken: generateRefreshToken({ sub: user._id || user.id, role: user.role })
});

export const authService = {
  async register(body) {
    const { fullName, email, password, role } = body;
    if (useDemoData()) {
      const existing = demoStore.findOne("users", (u) => u.email === email);
      if (existing) { const e = new Error("User already exists with this email."); e.statusCode = 400; throw e; }
      const created = demoStore.create("users", { fullName, email, password, role: role || "staff", isActive: true });
      return { message: "Registered successfully", ...tokensForUser(created) };
    }
    const existing = await User.findOne({ email });
    if (existing) { const e = new Error("User already exists with this email."); e.statusCode = 400; throw e; }
    const user = await User.create({ fullName, email, password, role: role || "staff", isActive: true });
    return { message: "Registered successfully", ...tokensForUser(user.toObject()) };
  },

  async login(body) {
    const { email, password } = body;
    if (useDemoData()) {
      const user = demoStore.findOne("users", (u) => u.email === email);
      if (!user || user.password !== password) { const e = new Error("Invalid email or password."); e.statusCode = 401; throw e; }
      if (!user.isActive) { const e = new Error("Your account is deactivated."); e.statusCode = 403; throw e; }
      return { message: "Login successful", ...tokensForUser(user) };
    }
    const user = await User.findOne({ email });
    if (!user) { const e = new Error("Invalid email or password."); e.statusCode = 401; throw e; }
    if (!user.isActive) { const e = new Error("Your account is deactivated."); e.statusCode = 403; throw e; }
    if (!(await bcrypt.compare(password, user.password))) { const e = new Error("Invalid email or password."); e.statusCode = 401; throw e; }
    return { message: "Login successful", ...tokensForUser(user.toObject()) };
  },

  async me(user) {
    return { data: user };
  },

  async forgotPassword(body) {
    const { email } = body;
    const resetToken = jwt.sign({ email }, env.jwtAccessSecret, { expiresIn: "15m" });
    if (useDemoData()) {
      const user = demoStore.findOne("users", (u) => u.email === email);
      if (user) return { message: "If the email exists, a reset link has been sent.", data: { resetToken } };
      return { message: "If the email exists, a reset link has been sent." };
    }
    const user = await User.findOne({ email });
    if (user) return { message: "If the email exists, a reset link has been sent.", data: { resetToken } };
    return { message: "If the email exists, a reset link has been sent." };
  },

  async changePassword(body, userId) {
    const { currentPassword, newPassword, resetToken } = body;
    if (resetToken) {
      let payload;
      try { payload = jwt.verify(resetToken, env.jwtAccessSecret); }
      catch { const e = new Error("Invalid or expired reset token."); e.statusCode = 401; throw e; }
      if (useDemoData()) {
        const user = demoStore.findOne("users", (u) => u.email === payload.email);
        if (!user) return { message: "If the email exists, a reset link has been sent." };
        demoStore.update("users", user._id, { password: newPassword });
        return { message: "Password changed successfully" };
      }
      const user = await User.findOne({ email: payload.email });
      if (!user) return { message: "If the email exists, a reset link has been sent." };
      user.password = newPassword;
      await user.save();
      return { message: "Password changed successfully" };
    }
    if (useDemoData()) {
      const user = demoStore.get("users", userId);
      if (!user) { const e = new Error("User not found"); e.statusCode = 404; throw e; }
      if (user.password !== currentPassword) { const e = new Error("Current password is incorrect"); e.statusCode = 401; throw e; }
      demoStore.update("users", userId, { password: newPassword });
      return { message: "Password changed successfully" };
    }
    const user = await User.findById(userId);
    if (!user) { const e = new Error("User not found"); e.statusCode = 404; throw e; }
    if (!(await user.comparePassword(currentPassword))) { const e = new Error("Current password is incorrect"); e.statusCode = 401; throw e; }
    user.password = newPassword;
    await user.save();
    return { message: "Password changed successfully" };
  },

  async refreshToken(refreshToken) {
    if (!refreshToken) { const e = new Error("Refresh token required"); e.statusCode = 401; throw e; }
    let payload;
    try { payload = jwt.verify(refreshToken, env.jwtRefreshSecret); }
    catch { const e = new Error("Invalid or expired refresh token"); e.statusCode = 401; throw e; }
    return { accessToken: generateAccessToken({ sub: payload.sub, role: payload.role }) };
  }
};
