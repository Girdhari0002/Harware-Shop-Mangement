import { Product } from "../models/Product.model.js";
import { Sale } from "../models/Sale.model.js";
import { Purchase } from "../models/Purchase.model.js";
import { Invoice } from "../models/Invoice.model.js";
import { Customer } from "../models/Customer.model.js";
import { Supplier } from "../models/Supplier.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

export const searchService = {
  async global(q = "") {
    const term = String(q).toLowerCase();
    if (!term) return { products: [], invoices: [], customers: [], suppliers: [] };
    if (useDemoData()) {
      const products = demoStore.findAll("products", { filter: (p) => (p.name && p.name.toLowerCase().includes(term)) || (p.sku && p.sku.toLowerCase().includes(term)) || (p.code && p.code.toLowerCase().includes(term)) || (p.barcode && String(p.barcode).toLowerCase().includes(term)) });
      const invoices = demoStore.findAll("invoices", { filter: (i) => String(i.invoiceNo || "").toLowerCase().includes(term) });
      const customers = demoStore.findAll("customers", { filter: (c) => (c.name && c.name.toLowerCase().includes(term)) || (c.phone && c.phone.includes(term)) });
      const suppliers = demoStore.findAll("suppliers", { filter: (s) => (s.name && s.name.toLowerCase().includes(term)) || (s.phone && s.phone.includes(term)) });
      return { products, invoices, customers, suppliers };
    }
    const [products, invoices, customers, suppliers] = await Promise.all([
      Product.find({ $or: [{ name: { $regex: q, $options: "i" } }, { sku: { $regex: q, $options: "i" } }, { code: { $regex: q, $options: "i" } }, { barcode: { $regex: q, $options: "i" } }] }).limit(20),
      Invoice.find({ invoiceNo: { $regex: q, $options: "i" } }).limit(20),
      Customer.find({ $or: [{ name: { $regex: q, $options: "i" } }, { phone: { $regex: q, $options: "i" } }] }).limit(20),
      Supplier.find({ $or: [{ name: { $regex: q, $options: "i" } }, { phone: { $regex: q, $options: "i" } }] }).limit(20)
    ]);
    return { products, invoices, customers, suppliers };
  },

  async byBarcode(barcode) {
    if (useDemoData()) return { product: demoStore.findOne("products", (p) => String(p.barcode) === String(barcode)) || null };
    return { product: await Product.findOne({ barcode }) };
  }
};
