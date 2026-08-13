import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    category: { type: String, enum: ["rent","salary","transport","utilities","maintenance","marketing","misc"], default: "misc" },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);
export const Expense = mongoose.model("Expense", expenseSchema);