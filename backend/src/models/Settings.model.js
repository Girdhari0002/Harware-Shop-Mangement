import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, default: "Hardware & Plywood Shop" },
    logo: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    gstType: { type: String, enum: ["regular", "composition", "unregistered"], default: "regular" },
    panNumber: { type: String, default: "" },
    invoicePrefix: { type: String, default: "INV" },
    invoiceStartNumber: { type: Number, default: 1 }
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    company: { type: companySchema, default: () => ({}) },
    currency: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    roundOff: { type: Boolean, default: true },
    gstNumber: { type: String, default: "" },
    state: { type: String, default: "" },
    stateCode: { type: String, default: "" },
    fiscalYear: { type: String, default: "" },
    backupReminderDays: { type: Number, default: 7 }
  },
  { timestamps: true }
);

settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export const Settings = mongoose.model("Settings", settingsSchema);
