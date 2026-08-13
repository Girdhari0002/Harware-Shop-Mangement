import { Product } from "../models/Product.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";
import { calculateGstAmounts } from "../utils/gstCalculator.js";

const coll = "products";

const resolveRef = (id, list) => {
  if (!id || typeof id === "object") return id || null;
  return demoStore.findOne(list, (item) => item._id === id || item.id === id) || { _id: id, id, name: id };
};

const sanitize = (body) => ({
  ...body,
  category: body.category ? resolveRef(body.category, "categories") : null,
  brand: body.brand ? resolveRef(body.brand, "brands") : null,
  isActive: body.isActive !== undefined ? body.isActive : body.isActive !== false,
  status: body.isActive === false ? "inactive" : body.status || "active",
  buyPrice: Number(body.buyPrice || 0),
  sellPrice: Number(body.sellPrice || 0),
  quantity: Number(body.quantity || 0),
  minStock: Number(body.minStock || 0),
  gstPercent: Number(body.gstPercent || 0)
});

export const productService = {
  async list({ search, category, brand, lowStock, status, page, limit, sortBy = "-createdAt" } = {}) {
    const filterFn = (item) => {
      const matchSearch = !search ||
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.sku && item.sku.toLowerCase().includes(search.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(search.toLowerCase())) ||
        (item.barcode && String(item.barcode).toLowerCase().includes(search.toLowerCase()));
      const matchCategory = !category || String(item.category?._id || item.category) === String(category) || item.category?.name === category;
      const matchBrand = !brand || String(item.brand?._id || item.brand) === String(brand) || item.brand?.name === brand;
      const matchLowStock = lowStock ? item.quantity <= item.minStock : true;
      const matchStatus = !status || item.status === status || String(item.isActive) === String(status === "inactive" ? false : true).slice(0, 1);
      return matchSearch && matchCategory && matchBrand && matchLowStock && matchStatus;
    };

    if (useDemoData()) {
      const result = demoStore.list(coll, { filter: filterFn, sortBy: sortBy.replace("-", ""), sortOrder: sortBy.startsWith("-") ? -1 : 1, page, limit });
      return result;
    }

    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }, { code: { $regex: search, $options: "i" } }, { barcode: { $regex: search, $options: "i" } }];
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (status) filter.status = status;

    let query = Product.find(filter).populate("category", "name").populate("brand", "name").sort(sortBy);
    const total = await Product.countDocuments(filter);
    if (page && limit) query = query.skip((page - 1) * limit).limit(Number(limit));
    else if (limit) query = query.limit(Number(limit));
    return { data: await query.exec(), total, page: page || 1, limit: limit || total };
  },

  async getById(id) {
    if (useDemoData()) {
      const item = demoStore.get(coll, id);
      return item ? { data: item } : null;
    }
    const item = await Product.findById(id).populate("category", "name").populate("brand", "name");
    return item ? { data: item } : null;
  },

  async create(body) {
    const data = sanitize(body);
    if (useDemoData()) return { data: demoStore.create(coll, data) };
    const item = await Product.create(data);
    return { data: item };
  },

  async update(id, body) {
    const data = sanitize(body);
    if (useDemoData()) {
      const item = demoStore.update(coll, id, data);
      return item ? { data: item } : null;
    }
    const item = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("category", "name").populate("brand", "name");
    return item ? { data: item } : null;
  },

  async remove(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const result = await Product.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },

  async adjustStock(id, delta) {
    if (useDemoData()) {
      const item = demoStore.get(coll, id);
      if (!item) return null;
      return demoStore.update(coll, id, { quantity: Math.max(0, item.quantity + delta) });
    }
    const item = await Product.findByIdAndUpdate(id, { $inc: { quantity: delta } }, { new: true });
    return item;
  },

  async lowStock() {
    if (useDemoData()) return demoStore.findAll(coll, { filter: (item) => item.quantity <= item.minStock });
    return Product.find({ $expr: { $lte: ["$quantity", "$minStock"] } }).populate("category", "name").populate("brand", "name");
  }
};

export const calculateGstAmountsProduct = calculateGstAmounts;
