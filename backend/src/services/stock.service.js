import { Product } from "../models/Product.model.js";
import { AuditLog } from "../models/AuditLog.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const sanitize = (a) => ({ _id: a._id, id: a.id, fullName: a.fullName, email: a.email, role: a.role, isActive: a.isActive, createdAt: a.createdAt, updatedAt: a.updatedAt });

export const stockService = {
  async adjust(productId, delta, { reason = "", userId = null, userName = "" } = {}) {
    if (useDemoData()) {
      const prod = demoStore.get("products", productId);
      if (!prod) { const e = new Error("Product not found"); e.statusCode = 404; throw e; }
      const updated = demoStore.update("products", prod._id, { quantity: Math.max(0, prod.quantity + delta) });
      demoStore.create("auditlogs", { user: userId, userName, action: "stock_adjust", entityType: "Product", entityId: String(productId), changes: { reason, delta } });
      return updated;
    }
    const product = await Product.findById(productId);
    if (!product) { const e = new Error("Product not found"); e.statusCode = 404; throw e; }
    product.quantity = Math.max(0, product.quantity + delta);
    await product.save();
    await AuditLog.create({ user: userId, userName, action: "stock_adjust", entityType: "Product", entityId: String(productId), changes: { reason, delta } });
    return product;
  },
  async history(productId) {
    if (useDemoData()) {
      return demoStore.findAll("auditlogs", { filter: (l) => l.entityType === "Product" && (l.entityId === String(productId)) });
    }
    return AuditLog.find({ entityType: "Product", entityId: String(productId) }).sort("-createdAt");
  }
};
