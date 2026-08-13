import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    alternatePhone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    gstType: { type: String, enum: ["regular", "composition", "unregistered", "sez", "overseas"], default: "regular" },
    gstNumber: { type: String, trim: true, default: "" },
    contactPerson: { type: String, trim: true, default: "" },
    openingBalance: { type: Number, default: 0, min: 0 },
    currentBalance: { type: Number, default: 0 },
    creditLimit: { type: Number, default: 0, min: 0 },
    paymentTerms: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

supplierSchema.virtual("outstandingBalance").get(function () {
  return this.currentBalance;
});

export const Supplier = mongoose.model("Supplier", supplierSchema);
