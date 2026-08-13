import { Notification } from "../models/Notification.model.js";
import { Product } from "../models/Product.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const coll = "notifications";
const sanitize = (n) => ({
  _id: n._id, id: n.id, title: n.title, message: n.message, type: n.type, isRead: n.isRead,
  priority: n.priority, entityType: n.entityType, entityId: n.entityId, createdAt: n.createdAt, updatedAt: n.updatedAt
});

export const notificationService = {
  async list({ read, type, page, limit, sortBy = "-createdAt" } = {}) {
    const filterFn = (item) =>
      (!read ? true : read === "true" ? Boolean(item.isRead) : !item.isRead) && (!type || item.type === type);
    if (useDemoData()) {
      return demoStore.list(coll, { filter: filterFn, sortBy: sortBy.replace("-", ""), sortOrder: sortBy.startsWith("-") ? -1 : 1, page, limit });
    }
    const filter = {};
    if (read === "true") filter.isRead = true;
    if (read === "false") filter.isRead = false;
    if (type) filter.type = type;
    let query = Notification.find(filter).sort(sortBy);
    const total = await Notification.countDocuments(filter);
    if (page && limit) query = query.skip((page - 1) * limit).limit(Number(limit));
    return { data: await query.exec(), total, page: page || 1, limit: limit || total };
  },

  async unreadCount() {
    if (useDemoData()) return demoStore.findAll(coll, { filter: (n) => !n.isRead }).length;
    return Notification.countDocuments({ isRead: false });
  },

  async markRead(id) {
    if (useDemoData()) return demoStore.update(coll, id, { isRead: true, readAt: new Date().toISOString() });
    return Notification.findByIdAndUpdate(id, { isRead: true, readAt: new Date() }, { new: true });
  },

  async markAllRead() {
    if (useDemoData()) {
      demoStore.findAll(coll).forEach((n) => demoStore.update(coll, n._id, { isRead: true, readAt: new Date().toISOString() }));
      return { modified: true };
    }
    return Notification.updateMany({ isRead: false }, { isRead: true, readAt: new Date() });
  },

  async create(body) {
    const data = { ...body, isRead: false };
    if (useDemoData()) return { data: demoStore.create(coll, data) };
    return { data: await Notification.create(data) };
  },

  async getById(id) {
    if (useDemoData()) { const i = demoStore.get(coll, id); return i ? { data: i } : null; }
    const i = await Notification.findById(id);
    return i ? { data: i } : null;
  },
  async update(id, body) {
    if (useDemoData()) { const i = demoStore.update(coll, id, body); return i ? { data: i } : null; }
    const i = await Notification.findByIdAndUpdate(id, body, { new: true });
    return i ? { data: i } : null;
  },

  
  async remove(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const r = await Notification.deleteOne({ _id: id });
    return r.deletedCount > 0;
  },

  async checkLowStock() {
    const products = useDemoData()
      ? demoStore.findAll("products", { filter: (p) => (p.quantity || 0) <= (p.minStock || 0) && p.isActive !== false })
      : await Product.find({ $expr: { $lte: ["$quantity", "$minStock"] } }).lean();
    for (const p of products) {
      const existing = useDemoData()
        ? demoStore.findOne(coll, (n) => n.type === "low_stock" && n.entityId === String(p._id))
        : await Notification.findOne({ type: "low_stock", entityId: String(p._id) });
      if (!existing) {
        const notif = { type: "low_stock", title: "Low Stock", message: `${p.name} (${p.sku || ""}) is below minimum stock`, entityType: "Product", entityId: String(p._id), priority: "high" };
        if (useDemoData()) demoStore.create(coll, notif); else await Notification.create(notif);
      }
    }
    return products;
  }
};

