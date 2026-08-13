import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["low_stock", "out_of_stock", "payment_due", "pending_bill", "backup_reminder", "system"], default: "system" },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    entityType: { type: String, default: null },
    entityId: { type: String, default: null },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
  },
  { timestamps: true }
);

notificationSchema.index({ isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
