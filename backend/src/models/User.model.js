import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateEmployeeCode } from "../utils/employeeCode.js";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    role: { type: String, default: "staff" },
    isActive: { type: Boolean, default: true },
    // Numeric code used to print/scan a gate-pass barcode for on-site staff verification.
    employeeCode: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.employeeCode) this.employeeCode = generateEmployeeCode();
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);