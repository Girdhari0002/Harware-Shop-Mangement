import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, alt: { type: String, default: "" }, isPrimary: { type: Boolean, default: false } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, unique: true, sparse: true, default: "" },
    sku: { type: String, trim: true, unique: true, sparse: true, default: "" },
    barcode: { type: String, trim: true, unique: true, sparse: true, default: "" },
    description: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    subCategory: { type: String, trim: true, default: "" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
    thickness: { type: Number, default: null },
    length: { type: Number, default: null },
    width: { type: Number, default: null },
    color: { type: String, trim: true, default: "" },
    finish: { type: String, trim: true, default: "" },
    unit: { type: String, enum: ["pcs", "kg", "m", "sqft", "sheet", "box", "ltr"], default: "pcs" },
    gstPercent: { type: Number, default: 0, min: 0, max: 100 },
    hsnCode: { type: String, trim: true, default: "" },
    buyPrice: { type: Number, default: 0, min: 0 },
    sellPrice: { type: Number, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    quantity: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 },
    warehouseLocation: { type: String, trim: true, default: "" },
    images: { type: [imageSchema], default: [] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.minStock;
});

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });

export const Product = mongoose.model("Product", productSchema);
