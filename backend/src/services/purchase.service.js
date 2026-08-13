import { Purchase } from "../models/Purchase.model.js";
import { Product } from "../models/Product.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const coll = "purchases";

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
    // Quick purchase with no line items — trust the manually entered amount instead of zeroing it out.
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

const adjustStock = (items, delta) => {
  for (const item of items) {
    if (item.product && typeof item.product === "string") {
      if (useDemoData()) {
        const prod = demoStore.get("products", item.product);
        if (prod) demoStore.update("products", prod._id, { quantity: Math.max(0, prod.quantity + delta) });
      } else {
        Product.findByIdAndUpdate(item.product, { $inc: { quantity: delta } }).exec();
      }
  }
  }
};

export const purchaseService = {
  async list({ supplier, page, limit, sortBy = "-createdAt" } = {}) {
    const filterFn = (item) => !supplier || String(item.supplier?._id || item.supplier) === String(supplier);
    if (useDemoData()) {
      return demoStore.list(coll, { filter: filterFn, sortBy: sortBy.replace("-", ""), sortOrder: sortBy.startsWith("-") ? -1 : 1, page, limit });
    }
    const filter = supplier ? { supplier } : {};
    let query = Purchase.find(filter).populate("supplier", "name phone").sort(sortBy);
    const total = await Purchase.countDocuments(filter);
    if (page && limit) query = query.skip((page - 1) * limit).limit(Number(limit));
    return { data: await query.exec(), total, page: page || 1, limit: limit || total };
  },

  async getById(id) {
    if (useDemoData()) {
      const item = demoStore.get(coll, id);
      return item ? { data: item } : null;
    }
    const item = await Purchase.findById(id).populate("supplier", "name phone");
    return item ? { data: item } : null;
  },

  async create(body) {
    const totals = computeTotals(body);
    const payload = { ...body, ...totals };
    if (useDemoData()) {
      const item = demoStore.create(coll, payload);
      adjustStock(payload.items, 1);
      return { data: item };
    }
    const item = await Purchase.create(payload);
    await adjustStockProd(payload.items, 1);
    return { data: item };
  },

  async update(id, body) {
    if (body.items || body.discountAmount !== undefined || body.roundOff !== undefined) {
      const totals = computeTotals(body);
      body = { ...body, ...totals };
    }
    if (useDemoData()) {
      const item = demoStore.update(coll, id, body);
      return item ? { data: item } : null;
    }
    const item = await Purchase.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate("supplier", "name phone");
    return item ? { data: item } : null;
  },

  async remove(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const result = await Purchase.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
};

async function adjustStockProd(items, delta) {
  for (const item of items) {
    if (item.product) await Product.findByIdAndUpdate(item.product, { $inc: { quantity: delta } });
  }
}
