import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    productName: { type: String, required: true, trim: true },
    hsnCode: { type: String, default: "" },
    qty: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "pcs" },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    discount: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0, min: 0 },
    amount: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    date: { type: Date, default: Date.now },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    customerName: { type: String, default: "Walk-in Customer" },
    customerPhone: { type: String, trim: true, default: "" },
    customerAddress: { type: String, trim: true, default: "" },
    salesPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    items: [saleItemSchema],
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxableAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
    paymentMethod: { type: String, enum: ["cash", "upi", "bank", "cheque", "credit"], default: "cash" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

saleSchema.pre("validate", async function (next) {
  if (!this.invoiceNo) {
    const count = await this.constructor.countDocuments();
    this.invoiceNo = `INV-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export const Sale = mongoose.model("Sale", saleSchema);
