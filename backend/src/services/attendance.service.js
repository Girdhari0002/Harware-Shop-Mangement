import { Attendance } from "../models/Attendance.model.js";
import { User } from "../models/User.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const coll = "attendance";
const todayStr = () => new Date().toISOString().slice(0, 10);

export const attendanceService = {
  // Scan/enter a gate-pass code: first scan of the day checks in, second checks out.
  async scan(code) {
    if (!code) { const e = new Error("Gate pass code is required"); e.statusCode = 400; throw e; }

    const rawUser = useDemoData()
      ? demoStore.findOne("users", (u) => u.employeeCode === code)
      : await User.findOne({ employeeCode: code });
    if (!rawUser) { const e = new Error("No staff member found for this gate pass code"); e.statusCode = 404; throw e; }
    if (rawUser.isActive === false) { const e = new Error("This staff account is inactive"); e.statusCode = 403; throw e; }

    const user = useDemoData() ? rawUser : rawUser.toObject();
    const userId = String(user._id);
    const date = todayStr();
    const summary = { fullName: user.fullName, role: user.role };

    if (useDemoData()) {
      let record = demoStore.findOne(coll, (a) => String(a.user) === userId && a.date === date);
      if (!record) {
        record = demoStore.create(coll, { user: userId, userName: user.fullName, role: user.role, date, checkInAt: new Date().toISOString(), status: "present" });
        return { action: "checkin", record, user: summary };
      }
      if (!record.checkOutAt) {
        record = demoStore.update(coll, record._id, { checkOutAt: new Date().toISOString(), status: "checked-out" });
        return { action: "checkout", record, user: summary };
      }
      return { action: "already-done", record, user: summary };
    }

    let record = await Attendance.findOne({ user: userId, date });
    if (!record) {
      record = await Attendance.create({ user: userId, userName: user.fullName, role: user.role, date, checkInAt: new Date(), status: "present" });
      return { action: "checkin", record, user: summary };
    }
    if (!record.checkOutAt) {
      record.checkOutAt = new Date();
      record.status = "checked-out";
      await record.save();
      return { action: "checkout", record, user: summary };
    }
    return { action: "already-done", record, user: summary };
  },

  async list({ date, from, to } = {}) {
    if (useDemoData()) {
      const filter = (a) => {
        if (date) return a.date === date;
        if (from || to) return (!from || a.date >= from) && (!to || a.date <= to);
        return true;
      };
      return demoStore.findAll(coll, { filter, sortBy: "checkInAt", sortOrder: -1 });
    }
    const q = {};
    if (date) q.date = date;
    else if (from || to) q.date = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
    return Attendance.find(q).sort("-checkInAt");
  },

  async today() {
    return this.list({ date: todayStr() });
  }
};
