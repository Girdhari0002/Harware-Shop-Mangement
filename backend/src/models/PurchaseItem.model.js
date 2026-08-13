import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const PurchaseItem = mongoose.model("PurchaseItem", Schema);