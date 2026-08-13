import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";
import { User } from "../models/User.model.js";
import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { Brand } from "../models/Brand.model.js";
import { Supplier } from "../models/Supplier.model.js";
import { Customer } from "../models/Customer.model.js";
import { Sale } from "../models/Sale.model.js";
import { Purchase } from "../models/Purchase.model.js";
import { Invoice } from "../models/Invoice.model.js";
import { Expense } from "../models/Expense.model.js";
import { Payment } from "../models/Payment.model.js";
import { Notification } from "../models/Notification.model.js";
import { Settings } from "../models/Settings.model.js";

const MODELS = [
  { name: "users", model: User },
  { name: "products", model: Product },
  { name: "categories", model: Category },
  { name: "brands", model: Brand },
  { name: "suppliers", model: Supplier },
  { name: "customers", model: Customer },
  { name: "sales", model: Sale },
  { name: "purchases", model: Purchase },
  { name: "invoices", model: Invoice },
  { name: "expenses", model: Expense },
  { name: "payments", model: Payment },
  { name: "notifications", model: Notification },
  { name: "settings", model: Settings }
];

export const backupService = {
  async createBackup() {
    const createdAt = new Date().toISOString();
    if (useDemoData()) {
      return JSON.stringify({ createdAt, collections: demoStore.dump() });
    }
    const collections = {};
    for (const { name, model } of MODELS) {
      try { collections[name] = await model.find().lean(); } catch { collections[name] = []; }
    }
    return JSON.stringify({ createdAt, collections });
  },

  async restoreBackup(json) {
    const payload = typeof json === "string" ? JSON.parse(json) : json;
    const collections = payload.collections || {};
    if (useDemoData()) {
      demoStore.load(collections);
      return { restored: Object.keys(collections) };
    }
    for (const { name, model } of MODELS) {
      const docs = collections[name];
      if (!docs) continue;
      await model.deleteMany({});
      await model.insertMany(docs);
    }
    return { restored: Object.keys(collections) };
  }
};
