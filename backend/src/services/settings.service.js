import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";
import { generateEmployeeCode } from "../utils/employeeCode.js";
import { generateBarcodeSvg, generateQrSvg } from "./barcode.service.js";
import { excelService } from "./excel.service.js";

// Accepts a handful of common header spellings so an export from this same
// screen (or a hand-edited spreadsheet) round-trips without a strict schema.
const pick = (row, ...keys) => {
  for (const key of Object.keys(row)) {
    if (keys.includes(key.trim().toLowerCase())) return row[key];
  }
  return "";
};

const coll = "users";
const sanitize = (u) => ({ _id: u._id, id: u.id, fullName: u.fullName, email: u.email, phone: u.phone || "", address: u.address || "", role: u.role, isActive: u.isActive, employeeCode: u.employeeCode, createdAt: u.createdAt, updatedAt: u.updatedAt });

export const settingsService = {
  async listUsers() {
    if (useDemoData()) return demoStore.findAll(coll).map(sanitize);
    return User.find().select("-password").sort("-createdAt");
  },
  async getUser(id) {
    if (useDemoData()) { const u = demoStore.get(coll, id); return u ? sanitize(u) : null; }
    const u = await User.findById(id).select("-password");
    return u ? { ...u.toObject() } : null;
  },
  async createUser(body) {
    const { fullName, email, password, phone, address, role, isActive } = body;
    if (useDemoData()) {
      const existing = demoStore.findOne(coll, (u) => u.email === email);
      if (existing) { const e = new Error("Email already in use"); e.statusCode = 409; throw e; }
      const created = demoStore.create(coll, { fullName, email, password, phone: phone || "", address: address || "", role: role || "staff", isActive: isActive !== false, employeeCode: generateEmployeeCode() });
      return { data: sanitize(created) };
    }
    const existing = await User.findOne({ email });
    if (existing) { const e = new Error("Email already in use"); e.statusCode = 409; throw e; }
    const user = await User.create({ fullName, email, password, phone: phone || "", address: address || "", role: role || "staff", isActive: isActive !== false });
    return { data: sanitize({ ...user.toObject(), _id: user._id, id: user._id }) };
  },
  async updateUser(id, body) {
    const patch = { fullName: body.fullName, email: body.email, phone: body.phone, address: body.address, role: body.role, isActive: body.isActive };
    if (useDemoData()) {
      const u = demoStore.update(coll, id, patch);
      return u ? { data: sanitize(u) } : null;
    }
    const user = await User.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).select("-password");
    return user ? { data: user.toObject() } : null;
  },
  async changePassword(id, currentPassword, newPassword) {
    if (useDemoData()) {
      const u = demoStore.get(coll, id);
      if (!u) { const e = new Error("User not found"); e.statusCode = 404; throw e; }
      if (u.password !== currentPassword) { const e = new Error("Current password is incorrect"); e.statusCode = 401; throw e; }
      demoStore.update(coll, id, { password: newPassword });
      return { success: true };
    }
    const user = await User.findById(id);
    if (!user) { const e = new Error("User not found"); e.statusCode = 404; throw e; }
    if (!(await user.comparePassword(currentPassword))) { const e = new Error("Current password is incorrect"); e.statusCode = 401; throw e; }
    user.password = newPassword;
    await user.save();
    return { success: true };
  },
  async removeUser(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const r = await User.deleteOne({ _id: id });
    return r.deletedCount > 0;
  },

  // Bulk-create users from an uploaded CSV (Excel "Save As CSV" export).
  // Continues past bad rows instead of failing the whole batch, and reports why each one was skipped.
  async importUsers(csvText) {
    const rows = excelService.importFromCsv(csvText);
    const created = [];
    const skipped = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +1 for header row, +1 for 1-indexing
      const fullName = String(pick(row, "full name", "fullname", "name") || "").trim();
      const email = String(pick(row, "email", "e-mail") || "").trim().toLowerCase();
      const password = String(pick(row, "password") || "").trim();
      const roleRaw = String(pick(row, "role") || "staff").trim().toLowerCase();
      const role = roleRaw === "admin" ? "admin" : "staff";

      if (!fullName || !email) { skipped.push({ row: rowNum, email, reason: "Missing full name or email" }); continue; }
      if (!password || password.length < 6) { skipped.push({ row: rowNum, email, reason: "Password missing or too short (min 6 chars)" }); continue; }

      try {
        const { data } = await this.createUser({ fullName, email, password, role });
        created.push(data);
      } catch (e) {
        skipped.push({ row: rowNum, email, reason: e.statusCode === 409 ? "Email already in use" : (e.message || "Failed to create") });
      }
    }
    return { created, skipped };
  },

  // Gate-pass badge (barcode + QR) for a single staff/admin member.
  async getGatePass(id) {
    const raw = useDemoData() ? demoStore.get(coll, id) : await User.findById(id);
    if (!raw) return null;
    const user = useDemoData() ? raw : raw.toObject();
    const code = user.employeeCode;
    return {
      data: {
        user: sanitize(user),
        employeeCode: code,
        barcodeSvg: code ? generateBarcodeSvg(code) : "",
        qrSvg: code ? await generateQrSvg(code) : ""
      }
    };
  },

  // Gate-pass verification — look a staff member up by the code scanned/entered at the gate.
  async verifyByEmployeeCode(code) {
    const raw = useDemoData()
      ? demoStore.findOne(coll, (u) => u.employeeCode === code)
      : await User.findOne({ employeeCode: code });
    if (!raw) return null;
    const user = useDemoData() ? raw : raw.toObject();
    return { data: sanitize(user) };
  }
};
