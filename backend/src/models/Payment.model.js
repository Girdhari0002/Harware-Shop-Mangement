import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    partyType: { type: String, enum: ["customer", "supplier"], required: true },
    party: { type: mongoose.Schema.Types.ObjectId, refPath: "partyType", default: null },
    partyName: { type: String, default: "" },
    amount: { type: Number, required: true, default: 0, min: 0 },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["cash", "upi", "bank", "cheque", "credit"], default: "cash" },
    reference: { type: String, default: "" },
    status: { type: String, enum: ["pending", "cleared", "bounced"], default: "cleared" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
