import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    hsnCode: { type: String, default: "" },
    qty: { type: Number, required: true },
    unit: { type: String, default: "pcs" },
    price: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    amount: { type: Number, required: true }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, trim: true },
    type: { type: String, enum: ["sale", "purchase"], required: true },
    reference: { type: mongoose.Schema.Types.ObjectId, refPath: "referenceModel", default: null },
    referenceModel: { type: String, enum: ["Sale", "Purchase"], default: null },
    date: { type: Date, default: Date.now },
    party: { type: String, default: "" },
    items: [invoiceItemSchema],
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "generated", "pdf", "shared"], default: "generated" },
    pdfPath: { type: String, default: "" },
    qrCode: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
