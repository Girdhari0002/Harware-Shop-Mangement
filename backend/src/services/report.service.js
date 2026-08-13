import { Sale } from "../models/Sale.model.js";
import { Purchase } from "../models/Purchase.model.js";
import { Product } from "../models/Product.model.js";
import { Invoice } from "../models/Invoice.model.js";
import { Customer } from "../models/Customer.model.js";
import { Supplier } from "../models/Supplier.model.js";
import { Payment } from "../models/Payment.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const toDate = (d) => (d ? new Date(d) : null);
const inRange = (d, from, to) => {
  const t = new Date(d).getTime();
  return (!from || t >= new Date(from).getTime()) && (!to || t <= new Date(to).setHours(23, 59, 59, 999));
};
const dayKey = (d) => new Date(d).toISOString().slice(0, 10);

export const reportService = {
  async salesReport({ from, to, groupBy = "day" } = {}) {
    const filter = (s) => inRange(s.date || s.createdAt, from, to);
    if (useDemoData()) {
      const rows = demoStore.findAll("sales", { filter });
      const map = new Map();
      for (const s of rows) {
        const key = groupBy === "month" ? dayKey(s.date).slice(0, 7) : dayKey(s.date);
        const cur = map.get(key) || { period: key, sales: 0, count: 0, tax: 0 };
        cur.sales += s.netAmount || 0;
        cur.count += 1;
        cur.tax += s.taxAmount || 0;
        map.set(key, cur);
      }
      return Array.from(map.values()).sort((a, b) => (a.period < b.period ? -1 : 1));
    }
    const match = { createdAt: {} };
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
    const g = groupBy === "month" ? { $dateToString: { format: "%Y-%m", date: "$date" } } : { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
    return Sale.aggregate([
      { $match: match },
      { $group: { _id: g, sales: { $sum: "$netAmount" }, count: { $sum: 1 }, tax: { $sum: "$taxAmount" } } },
      { $project: { _id: 0, period: "$_id", sales: 1, count: 1, tax: 1 } },
      { $sort: { period: 1 } }
    ]);
  },

  async purchaseReport({ from, to } = {}) {
    const filter = (p) => inRange(p.date || p.createdAt, from, to);
    if (useDemoData()) {
      const rows = demoStore.findAll("purchases", { filter });
      const map = new Map();
      for (const p of rows) {
        const key = dayKey(p.date);
        const cur = map.get(key) || { period: key, purchases: 0, count: 0, tax: 0 };
        cur.purchases += p.netAmount || 0;
        cur.count += 1;
        cur.tax += p.taxAmount || 0;
        map.set(key, cur);
      }
      return Array.from(map.values()).sort((a, b) => (a.period < b.period ? -1 : 1));
    }
    return Purchase.aggregate([
      { $match: from || to ? { createdAt: { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) } } : {} },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, purchases: { $sum: "$netAmount" }, count: { $sum: 1 }, tax: { $sum: "$taxAmount" } } },
      { $project: { _id: 0, period: "$_id", purchases: 1, count: 1, tax: 1 } },
      { $sort: { period: 1 } }
    ]);
  },

  async gstReport({ from, to } = {}) {
    const filter = (s) => inRange(s.date || s.createdAt, from, to);
    if (useDemoData()) {
      const rows = demoStore.findAll("sales", { filter });
      const map = new Map();
      for (const s of rows) {
        const key = String(s.taxRate || 0);
        const cur = map.get(key) || { rate: Number(key), taxable: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, total: 0 };
        cur.taxable += s.taxableAmount || 0;
        cur.cgst += s.cgstAmount || 0;
        cur.sgst += s.sgstAmount || 0;
        cur.igst += s.igstAmount || 0;
        cur.tax += s.taxAmount || 0;
        cur.total += s.netAmount || 0;
        map.set(key, cur);
      }
      return Array.from(map.values());
    }
    return Sale.aggregate([
      { $match: from || to ? { createdAt: { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) } } : {} },
      { $group: { _id: "$taxRate", taxable: { $sum: "$taxableAmount" }, cgst: { $sum: "$cgstAmount" }, sgst: { $sum: "$sgstAmount" }, igst: { $sum: "$igstAmount" }, tax: { $sum: "$taxAmount" }, total: { $sum: "$netAmount" } } },
      { $project: { _id: 0, rate: "$_id", taxable: 1, cgst: 1, sgst: 1, igst: 1, tax: 1, total: 1 } }
    ]);
  },

  async stockReport() {
    if (useDemoData()) {
      return demoStore.findAll("products", { filter: () => true }).map((p) => ({
        name: p.name, sku: p.sku, quantity: p.quantity, minStock: p.minStock, buyPrice: p.buyPrice, value: p.quantity * p.buyPrice, isLowStock: p.quantity <= p.minStock
      }));
    }
    return Product.aggregate([
      { $project: { name: 1, sku: 1, quantity: 1, minStock: 1, buyPrice: 1, value: { $multiply: ["$quantity", "$buyPrice"] }, isLowStock: { $cond: [{ $lte: ["$quantity", "$minStock"] }, true, false] } } }
    ]);
  },

  async profitReport({ from, to } = {}) {
    const filter = (s) => inRange(s.date || s.createdAt, from, to);
    if (useDemoData()) {
      const sales = demoStore.findAll("sales", { filter });
      const purchases = demoStore.findAll("purchases", { filter });
      const saleTotal = sales.reduce((s, x) => s + (x.netAmount || 0), 0);
      const purchaseTotal = purchases.reduce((s, x) => s + (x.netAmount || 0), 0);
      return { sales: saleTotal, purchases: purchaseTotal, profit: Math.round((saleTotal - purchaseTotal) * 100) / 100 };
    }
    const sales = await Sale.aggregate([{ $match: from || to ? { createdAt: { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) } } : {} }, { $group: { _id: null, total: { $sum: "$netAmount" } } }]);
    const purchases = await Purchase.aggregate([{ $match: from || to ? { createdAt: { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) } } : {} }, { $group: { _id: null, total: { $sum: "$netAmount" } } }]);
    const saleTotal = sales[0]?.total || 0;
    const purchaseTotal = purchases[0]?.total || 0;
    return { sales: saleTotal, purchases: purchaseTotal, profit: Math.round((saleTotal - purchaseTotal) * 100) / 100 };
  },

  async customerLedger(customerId) {
    if (useDemoData()) {
      const sales = demoStore.findAll("sales", { filter: (s) => String(s.customer?._id || s.customer) === String(customerId) });
      const payments = demoStore.findAll("payments", { filter: (p) => p.partyType === "customer" && String(p.party) === String(customerId) });
      const customer = demoStore.get("customers", customerId);
      return { customer: customer || { name: "Unknown" }, sales, payments, openingBalance: customer?.openingBalance || 0, currentBalance: customer?.currentBalance || 0 };
    }
    const [customer, sales, payments] = await Promise.all([
      Customer.findById(customerId),
      Sale.find({ customer: customerId }),
      Payment.find({ partyType: "customer", party: customerId })
    ]);
    return { customer, sales, payments, openingBalance: customer?.openingBalance || 0, currentBalance: customer?.currentBalance || 0 };
  },

  async supplierLedger(supplierId) {
    if (useDemoData()) {
      const purchases = demoStore.findAll("purchases", { filter: (s) => String(s.supplier?._id || s.supplier) === String(supplierId) });
      const payments = demoStore.findAll("payments", { filter: (p) => p.partyType === "supplier" && String(p.party) === String(supplierId) });
      const supplier = demoStore.get("suppliers", supplierId);
      return { supplier: supplier || { name: "Unknown" }, purchases, payments, openingBalance: supplier?.openingBalance || 0, currentBalance: supplier?.currentBalance || 0 };
    }
    const [supplier, purchases, payments] = await Promise.all([
      Supplier.findById(supplierId),
      Purchase.find({ supplier: supplierId }),
      Payment.find({ partyType: "supplier", party: supplierId })
    ]);
    return { supplier, purchases, payments, openingBalance: supplier?.openingBalance || 0, currentBalance: supplier?.currentBalance || 0 };
  },

  async topProducts({ limit = 10 } = {}) {
    if (useDemoData()) {
      const products = demoStore.findAll("products", { filter: () => true });
      return products.slice(0, limit).map((p) => ({ name: p.name, quantity: p.quantity, sellPrice: p.sellPrice }));
    }
    return Product.find().sort("-quantity").limit(limit);
  },

  async bestCustomers({ limit = 10 } = {}) {
    if (useDemoData()) {
      const map = new Map();
      for (const s of demoStore.findAll("sales")) {
        const key = String(s.customer?._id || s.customer || s.customerName);
        const cur = map.get(key) || { name: s.customer?.name || s.customerName || "Walk-in Customer", sales: 0, spent: 0 };
        cur.sales += 1; cur.spent += s.netAmount || 0;
        map.set(key, cur);
      }
      return Array.from(map.values()).sort((a, b) => b.spent - a.spent).slice(0, limit);
    }
    return Customer.aggregate([
      { $lookup: { from: "sales", localField: "_id", foreignField: "customer", as: "sales" } },
      { $addFields: { totalSales: { $size: "$sales" }, totalSpent: { $sum: "$sales.netAmount" } } },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      { $project: { name: 1, email: 1, totalSales: 1, totalSpent: 1 } }
    ]);
  }
};
