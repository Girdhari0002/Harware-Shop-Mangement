import { Sale } from "../models/Sale.model.js";
import { Purchase } from "../models/Purchase.model.js";
import { Product } from "../models/Product.model.js";
import { Customer } from "../models/Customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { useDemoData } from "../utils/demoData.js";
import { demoStore } from "../utils/demoStore.js";

const isToday = (value) => {
  const d = new Date(value);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

const buildDemoDashboard = () => {
  const sales = demoStore.findAll("sales");
  const purchases = demoStore.findAll("purchases");
  const products = demoStore.findAll("products");
  const customers = demoStore.findAll("customers");

  const todaySales = sales.filter((s) => isToday(s.date || s.createdAt)).reduce((sum, s) => sum + (s.netAmount || 0), 0);
  const todayPurchase = purchases.filter((p) => isToday(p.date || p.createdAt)).reduce((sum, p) => sum + (p.netAmount || 0), 0);
  const totalProducts = products.filter((p) => p.isActive).length;
  const totalCustomers = customers.filter((c) => c.isActive).length;
  const lowStock = products.filter((p) => p.isActive && p.quantity <= p.minStock).slice(0, 5)
    .map((p) => ({ name: p.name, quantity: p.quantity, minStock: p.minStock, unit: p.unit }));
  const recentSales = [...sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    .map((s) => ({ invoiceNo: s.invoiceNo, customerName: s.customerName, netAmount: s.netAmount, paymentStatus: s.paymentStatus, createdAt: s.createdAt }));

  return { todaySales, todayPurchase, todayProfit: todaySales - todayPurchase, totalProducts, totalCustomers, lowStock, recentSales };
};

export const listDashboard = asyncHandler(async (req, res) => {
  if (useDemoData()) {
    return res.json({ success: true, data: buildDemoDashboard() });
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
  const [ts, tp, totalProducts, totalCustomers, lowStock, recentSales] = await Promise.all([
    Sale.aggregate([{ $match: { createdAt: { $gte: today, $lte: todayEnd } } }, { $group: { _id: null, total: { $sum: "$netAmount" } } }]),
    Purchase.aggregate([{ $match: { createdAt: { $gte: today, $lte: todayEnd } } }, { $group: { _id: null, total: { $sum: "$netAmount" } } }]),
    Product.countDocuments({ isActive: true }),
    Customer.countDocuments({ isActive: true }),
    Product.find({ $expr: { $lte: ["$quantity", "$minStock"] }, isActive: true }).limit(5).select("name quantity minStock unit"),
    Sale.find().sort("-createdAt").limit(5).select("invoiceNo customerName netAmount paymentStatus createdAt")
  ]);
  res.json({ success: true, data: { todaySales: ts[0]?.total || 0, todayPurchase: tp[0]?.total || 0, todayProfit: (ts[0]?.total || 0) - (tp[0]?.total || 0), totalProducts, totalCustomers, lowStock, recentSales } });
});
