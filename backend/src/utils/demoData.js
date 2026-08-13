import mongoose from "mongoose";
import { env } from "../config/env.js";

export const useDemoData = () => env.skipDb || (env.nodeEnv !== "production" && mongoose.connection.readyState !== 1);

export const clone = (value) => JSON.parse(JSON.stringify(value));

const ts = (hoursAgo = 0) => new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

export const demoUsers = [
  {
    _id: "demo-admin",
    id: "demo-admin",
    fullName: "Admin User",
    email: "admin@erp.local",
    password: "Admin@123",
    role: "admin",
    isActive: true,
    employeeCode: "900000000001",
    createdAt: ts(48),
    updatedAt: ts(48)
  },
  {
    _id: "demo-staff",
    id: "demo-staff",
    fullName: "Staff User",
    email: "staff@erp.local",
    password: "Staff@123",
    role: "staff",
    isActive: true,
    employeeCode: "900000000002",
    createdAt: ts(48),
    updatedAt: ts(48)
  }
];

export const demoCategories = [
  { _id: "demo-category-1", id: "demo-category-1", name: "Hardware", description: "Door fittings, handles, locks, hinges, screws, nails", isActive: true, createdAt: ts(24), updatedAt: ts(24) },
  { _id: "demo-category-2", id: "demo-category-2", name: "Plywood", description: "Wood sheets and panels", isActive: true, createdAt: ts(12), updatedAt: ts(12) },
  { _id: "demo-category-3", id: "demo-category-3", name: "Block Board", description: "Solid wood block core boards", isActive: true, createdAt: ts(23), updatedAt: ts(23) },
  { _id: "demo-category-4", id: "demo-category-4", name: "MDF", description: "Medium-density fibreboard sheets", isActive: true, createdAt: ts(22), updatedAt: ts(22) },
  { _id: "demo-category-5", id: "demo-category-5", name: "HDHMR", description: "High-density HMR boards", isActive: true, createdAt: ts(21), updatedAt: ts(21) },
  { _id: "demo-category-6", id: "demo-category-6", name: "Laminate", description: "Decorative surface laminates", isActive: true, createdAt: ts(20), updatedAt: ts(20) },
  { _id: "demo-category-7", id: "demo-category-7", name: "Veneer", description: "Natural wood veneer sheets", isActive: true, createdAt: ts(19), updatedAt: ts(19) },
  { _id: "demo-category-8", id: "demo-category-8", name: "Sunmica", description: "Sunmica sheets and finishes", isActive: true, createdAt: ts(18), updatedAt: ts(18) },
  { _id: "demo-category-9", id: "demo-category-9", name: "Adhesive/Fevicol", description: "Adhesives, fevicol and bonding agents", isActive: true, createdAt: ts(17), updatedAt: ts(17) },
  { _id: "demo-category-10", id: "demo-category-10", name: "Paint", description: "Wall paints, enamels and primers", isActive: true, createdAt: ts(16), updatedAt: ts(16) },
  { _id: "demo-category-11", id: "demo-category-11", name: "Tools", description: "Hand tools and power tools", isActive: true, createdAt: ts(15), updatedAt: ts(15) },
  { _id: "demo-category-12", id: "demo-category-12", name: "Others", description: "Miscellaneous items", isActive: true, createdAt: ts(14), updatedAt: ts(14) }
];

export const demoBrands = [
  { _id: "demo-brand-1", id: "demo-brand-1", name: "Asian Paints", description: "Paint products", isActive: true, createdAt: ts(20), updatedAt: ts(20) },
  { _id: "demo-brand-2", id: "demo-brand-2", name: "Greenply", description: "Plywood brand", isActive: true, createdAt: ts(8), updatedAt: ts(8) },
  { _id: "demo-brand-3", id: "demo-brand-3", name: "Century Ply", description: "Plywood and laminate brand", isActive: true, createdAt: ts(19), updatedAt: ts(19) },
  { _id: "demo-brand-4", id: "demo-brand-4", name: "Berger Paints", description: "Paint brand", isActive: true, createdAt: ts(18), updatedAt: ts(18) },
  { _id: "demo-brand-5", id: "demo-brand-5", name: "Pidilite (Fevicol)", description: "Adhesives brand", isActive: true, createdAt: ts(17), updatedAt: ts(17) },
  { _id: "demo-brand-6", id: "demo-brand-6", name: "Godrej", description: "Hardware and locks brand", isActive: true, createdAt: ts(16), updatedAt: ts(16) },
  { _id: "demo-brand-7", id: "demo-brand-7", name: "Hettich", description: "Furniture fittings brand", isActive: true, createdAt: ts(15), updatedAt: ts(15) },
  { _id: "demo-brand-8", id: "demo-brand-8", name: "Ebco", description: "Hardware fittings brand", isActive: true, createdAt: ts(14), updatedAt: ts(14) },
  { _id: "demo-brand-9", id: "demo-brand-9", name: "Bosch", description: "Power tools brand", isActive: true, createdAt: ts(13), updatedAt: ts(13) },
  { _id: "demo-brand-10", id: "demo-brand-10", name: "Stanley", description: "Hand tools brand", isActive: true, createdAt: ts(12), updatedAt: ts(12) }
];

export const demoProducts = [
  {
    _id: "demo-product-1",
    id: "demo-product-1",
    name: "MDF Sheet",
    code: "MDF-001",
    sku: "MDF-001",
    barcode: "8901234567890",
    description: "18mm MDF sheet",
    category: { _id: "demo-category-2", id: "demo-category-2", name: "Plywood" },
    subCategory: "MDF",
    brand: { _id: "demo-brand-2", id: "demo-brand-2", name: "Greenply" },
    thickness: 18,
    length: 2440,
    width: 1220,
    color: "Natural",
    finish: "Smooth",
    unit: "sheet",
    gstPercent: 18,
    hsnCode: "8543",
    buyPrice: 1200,
    sellPrice: 1500,
    discountPercent: 0,
    quantity: 25,
    minStock: 5,
    warehouseLocation: "A1",
    images: [],
    status: "active",
    isActive: true,
    createdAt: ts(6),
    updatedAt: ts(6)
  },
  {
    _id: "demo-product-2",
    id: "demo-product-2",
    name: "Wall Paint",
    code: "WPT-002",
    sku: "WPT-002",
    barcode: "8901234567891",
    description: "Premium wall paint",
    category: { _id: "demo-category-1", id: "demo-category-1", name: "Hardware" },
    subCategory: "Paint",
    brand: { _id: "demo-brand-1", id: "demo-brand-1", name: "Asian Paints" },
    thickness: null,
    length: null,
    width: null,
    color: "White",
    finish: "Matte",
    unit: "box",
    gstPercent: 18,
    hsnCode: "3212",
    buyPrice: 700,
    sellPrice: 950,
    discountPercent: 0,
    quantity: 40,
    minStock: 8,
    warehouseLocation: "B2",
    images: [],
    status: "active",
    isActive: true,
    createdAt: ts(3),
    updatedAt: ts(3)
  }
];

export const demoSuppliers = [
  { _id: "demo-supplier-1", id: "demo-supplier-1", name: "Greenply Industries", phone: "9876543210", email: "greenply@erp.local", address: "Surat", gstNumber: "240747XXXXX", openingBalance: 0, creditLimit: 50000, isActive: true, createdAt: ts(24), updatedAt: ts(24) }
];

export const demoCustomers = [
  { _id: "demo-customer-1", id: "demo-customer-1", name: "Ramesh Traders", phone: "9123456789", email: "ramesh@erp.local", address: "Surat", gstNumber: "240747YYYYY", openingBalance: 0, creditLimit: 20000, isActive: true, createdAt: ts(24), updatedAt: ts(24) }
];

export const demoSales = [
  {
    _id: "demo-sale-1",
    id: "demo-sale-1",
    invoiceNo: "INV-00001",
    date: ts(1),
    customer: { _id: "demo-customer-1", id: "demo-customer-1", name: "Ramesh Traders" },
    customerName: "Ramesh Traders",
    salesPerson: { _id: "demo-admin", id: "demo-admin", fullName: "Admin User" },
    items: [
      { product: { _id: "demo-product-1", id: "demo-product-1", name: "MDF Sheet", sku: "MDF-001" }, productName: "MDF Sheet", hsnCode: "8543", qty: 2, unit: "sheet", price: 1500, discount: 0, taxRate: 18, taxAmount: 540, amount: 3540 }
    ],
    subtotal: 3000,
    discountAmount: 0,
    taxableAmount: 3000,
    taxRate: 18,
    cgstAmount: 270,
    sgstAmount: 270,
    igstAmount: 0,
    taxAmount: 540,
    roundOff: 0,
    netAmount: 3540,
    paymentStatus: "paid",
    paymentMethod: "cash",
    notes: "Demo sale",
    createdAt: ts(1),
    updatedAt: ts(1)
  }
];

export const demoInvoices = [
  {
    _id: "demo-invoice-1",
    id: "demo-invoice-1",
    invoiceNo: "INV-00001",
    type: "sale",
    reference: "demo-sale-1",
    referenceModel: "Sale",
    date: demoSales[0].date,
    party: demoSales[0].customerName,
    items: demoSales[0].items.map((i) => ({
      description: i.productName,
      hsnCode: i.hsnCode,
      qty: i.qty,
      unit: i.unit,
      price: i.price,
      taxRate: i.taxRate,
      taxAmount: i.taxAmount,
      amount: i.amount
    })),
    subtotal: demoSales[0].subtotal,
    taxAmount: demoSales[0].taxAmount,
    netAmount: demoSales[0].netAmount,
    paymentStatus: demoSales[0].paymentStatus,
    status: "generated",
    createdAt: demoSales[0].createdAt,
    updatedAt: demoSales[0].updatedAt
  }
];

const seeded = new Set();
export const seedDemoStore = (demoStore) => {
  if (seeded.has(demoStore)) return;
  seeded.add(demoStore);
  demoStore.seed("users", demoUsers);
  demoStore.seed("categories", demoCategories);
  demoStore.seed("brands", demoBrands);
  demoStore.seed("products", demoProducts);
  demoStore.seed("suppliers", demoSuppliers);
  demoStore.seed("customers", demoCustomers);
  demoStore.seed("sales", demoSales);
  demoStore.seed("purchases", []);
  demoStore.seed("invoices", demoInvoices);
  demoStore.seed("expenses", []);
  demoStore.seed("payments", []);
  demoStore.seed("notifications", []);
  demoStore.seed("settings", []);
  demoStore.seed("auditlogs", []);
  demoStore.seed("attendance", []);
};

export default { useDemoData, clone, seedDemoStore };
