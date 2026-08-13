import { Settings } from "../models/Settings.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const coll = "settings";
const defaults = () => ({
  company: { name: "Hardware & Plywood Shop", logo: "", phone: "", email: "", address: "", pinCode: "", gstNumber: "", gstType: "regular", panNumber: "", invoicePrefix: "INV", invoiceStartNumber: 1 },
  currency: "INR",
  currencySymbol: "\u20B9",
  roundOff: true,
  gstNumber: "",
  state: "",
  stateCode: "",
  fiscalYear: "",
  backupReminderDays: 7
});

export const companyService = {
  async get() {
    if (useDemoData()) {
      let existing = demoStore.findOne(coll, () => true);
      if (!existing) existing = demoStore.create(coll, defaults());
      return { data: existing };
    }
    const settings = await Settings.getSettings();
    return { data: settings };
  },
  async update(body) {
    if (useDemoData()) {
      let existing = demoStore.findOne(coll, () => true);
      if (!existing) existing = demoStore.create(coll, defaults());
      const merged = { ...defaults(), ...existing, ...body, company: { ...existing.company, ...(body.company || {}) } };
      const updated = demoStore.update(coll, existing._id, merged);
      return { data: updated };
    }
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, body);
    await settings.save();
    return { data: settings };
  }
};
