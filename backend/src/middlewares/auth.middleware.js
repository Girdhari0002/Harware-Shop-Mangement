import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.model.js";
import { useDemoData } from "../utils/demoData.js";
import { demoStore } from "../utils/demoStore.js";

const demoUser = {
  id: "demo-admin",
  email: "admin@erp.local",
  fullName: "Admin User",
  role: "admin",
  isActive: true
};

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);

    if (useDemoData()) {
      const demoAccount = demoStore.get("users", payload.sub);
      if (demoAccount) {
        req.user = {
          id: demoAccount.id,
          email: demoAccount.email,
          fullName: demoAccount.fullName,
          role: demoAccount.role,
          isActive: demoAccount.isActive
        };
        return next();
      }
    }

    if (env.skipDb && payload.sub === demoUser.id) {
      req.user = {
        id: demoUser.id,
        email: demoUser.email,
        fullName: demoUser.fullName,
        role: demoUser.role,
        isActive: demoUser.isActive
      };
      return next();
    }

    // Load fresh user data from DB to ensure role/isActive are current
    const user = await User.findById(payload.sub).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid token: user not found" });
    if (!user.isActive) return res.status(403).json({ success: false, message: "Your account is deactivated." });
    // Attach sanitized user object to req.user
    req.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive
    };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};