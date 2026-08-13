import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    role: { type: String },
    date: { type: String, required: true }, // YYYY-MM-DD, one record per user per day
    checkInAt: { type: Date, required: true },
    checkOutAt: { type: Date },
    status: { type: String, enum: ["present", "checked-out"], default: "present" }
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
