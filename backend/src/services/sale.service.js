import { Sale } from "../models/Sale.model.js";
import { Product } from "../models/Product.model.js";
import { Customer } from "../models/Customer.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";
import { generateQrSvg } from "./barcode.service.js";
import { numberToWords } from "../utils/numberToWords.js";
import { companyService } from "./company.service.js";
import { env } from "../config/env.js";

const coll = "sales";

const computeTotals = (body) => {
  const items = (body.items || []).map((item) => {
    const qty = Number(item.qty || 0);
    const price = Number(item.price || 0);
    const discount = Number(item.discount || 0);
    const taxRate = Number(item.taxRate || 0);
    const lineTotal = qty * price - discount;
    const taxAmount = Math.round(((lineTotal * taxRate) / 100) * 100) / 100;
    const amount = Math.round((lineTotal + taxAmount) * 100) / 100;
    return { ...item, qty, price, discount, taxRate, taxAmount, amount };
  });

  if (!items.length) {
    // Quick sale with no line items — trust the manually entered amount instead of zeroing it out.
    const netAmount = Number(body.netAmount || 0);
    return { items, subtotal: netAmount, discountAmount: 0, taxableAmount: netAmount, cgstAmount: 0, sgstAmount: 0, igstAmount: 0, taxAmount: 0, roundOff: Number(body.roundOff || 0), netAmount };
  }

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discountAmount = items.reduce((s, i) => s + i.discount, 0);
  const taxableAmount = subtotal - discountAmount;
  // Sum each item's own tax (its own GST rate) rather than re-deriving from a single flat rate.
  const taxAmount = items.reduce((s, i) => s + i.taxAmount, 0);
  const cgstAmount = body.interstate ? 0 : Math.round((taxAmount / 2) * 100) / 100;
  const sgstAmount = body.interstate ? 0 : Math.round((taxAmount / 2) * 100) / 100;
  const igstAmount = body.interstate ? taxAmount : 0;
  const netAmount = Math.round((taxableAmount + taxAmount + Number(body.roundOff || 0)) * 100) / 100;
  return { items, subtotal, discountAmount, taxableAmount, cgstAmount, sgstAmount, igstAmount, taxAmount, roundOff: Number(body.roundOff || 0), netAmount };
};

// direction: -1 deducts stock (sale), +1 restores it (revert on delete/edit)
const adjustStock = (items, direction) => {
  for (const item of items) {
    const productId = typeof item.product === "string" ? item.product : item.product?._id;
    if (!productId) continue;
    const delta = direction * Number(item.qty || 0);
    if (!delta) continue;
    if (useDemoData()) {
      const prod = demoStore.findOne("products", (p) => String(p._id) === String(productId) || String(p.id) === String(productId));
      if (prod) demoStore.update("products", prod._id, { quantity: Math.max(0, prod.quantity + delta) });
    } else {
      Product.findByIdAndUpdate(productId, { $inc: { quantity: delta } }).exec();
    }
  }
};

export const saleService = {
  async list({ customer, paymentStatus, page, limit, sortBy = "-createdAt" } = {}) {
    const filterFn = (item) => (!customer || String(item.customer?._id || item.customer) === String(customer)) && (!paymentStatus || item.paymentStatus === paymentStatus);
    if (useDemoData()) {
      return demoStore.list(coll, { filter: filterFn, sortBy: sortBy.replace("-", ""), sortOrder: sortBy.startsWith("-") ? -1 : 1, page, limit });
    }
    const filter = {};
    if (customer) filter.customer = customer;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    let query = Sale.find(filter).populate("customer", "name phone").populate("salesPerson", "fullName").sort(sortBy);
    const total = await Sale.countDocuments(filter);
    if (page && limit) query = query.skip((page - 1) * limit).limit(Number(limit));
    return { data: await query.exec(), total, page: page || 1, limit: limit || total };
  },

  async getById(id) {
    if (useDemoData()) {
      const item = demoStore.get(coll, id);
      return item ? { data: item } : null;
    }
    const item = await Sale.findById(id).populate("customer", "name phone").populate("salesPerson", "fullName");
    return item ? { data: item } : null;
  },

  async create(body) {
    const totals = computeTotals(body);
    const payload = { ...body, ...totals };
    if (useDemoData()) {
      const item = demoStore.create(coll, payload);
      adjustStock(payload.items, -1);
      return { data: item };
    }
    const item = await Sale.create(payload);
    adjustStock(payload.items, -1);
    return { data: item };
  },

  async update(id, body) {
    if (body.items || body.discountAmount !== undefined || body.roundOff !== undefined) {
      const totals = computeTotals(body);
      body = { ...body, ...totals };
    }
    const existing = useDemoData() ? demoStore.get(coll, id) : await Sale.findById(id);
    if (!existing) return null;
    if (useDemoData()) {
      const beforeItems = existing.items || [];
      const afterItems = body.items || beforeItems;
      // revert then re-apply stock
      for (const it of beforeItems) adjustStock([it], 1);
      for (const it of afterItems) adjustStock([it], -1);
      const item = demoStore.update(coll, id, body);
      return item ? { data: item } : null;
    }
    const item = await Sale.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate("customer", "name phone").populate("salesPerson", "fullName");
    return item ? { data: item } : null;
  },

  async remove(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const result = await Sale.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  // Printable tax invoice — the sale, the seller's company profile, a QR code that links
  // straight to the public invoice-verification page, and the net amount spelled out in words.
  async getInvoice(id) {
    const result = await this.getById(id);
    if (!result) return null;
    const invoiceNo = result.data.invoiceNo || "";
    const verifyUrl = `${env.clientUrl}/?invoice=${encodeURIComponent(invoiceNo)}#verify-invoice`;
    const qrSvg = await generateQrSvg(verifyUrl);
    const { data: settings } = await companyService.get();
    return {
      data: {
        sale: result.data,
        qrSvg,
        company: settings?.company || {},
        amountInWords: numberToWords(result.data.netAmount)
      }
    };
  }
};

export default saleService;
