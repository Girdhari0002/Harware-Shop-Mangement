import { Payment } from "../models/Payment.model.js";
import { Customer } from "../models/Customer.model.js";
import { Supplier } from "../models/Supplier.model.js";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const coll = "payments";

const adjustParty = (body) => {
  const { partyType, party, amount, status } = body;
  if (!partyType || !party || !amount || status === "bounced") return;
  const partyColl = partyType === "customer" ? "customers" : "suppliers";
  if (useDemoData()) {
    const p = demoStore.get(partyColl, party);
    if (p) demoStore.update(partyColl, p._id, { currentBalance: Math.round((Number(p.currentBalance || 0) - Number(amount)) * 100) / 100 });
  } else {
    const Model = partyType === "customer" ? Customer : Supplier;
    Model.findByIdAndUpdate(party, { $inc: { currentBalance: -Number(amount) } }).exec();
  }
};

export const paymentService = {
  async list({ partyType, page, limit, sortBy = "-createdAt" } = {}) {
    const filterFn = (item) => !partyType || item.partyType === partyType;
    if (useDemoData()) return demoStore.list(coll, { filter: filterFn, sortBy: sortBy.replace("-", ""), sortOrder: sortBy.startsWith("-") ? -1 : 1, page, limit });
    const filter = partyType ? { partyType } : {};
    let query = Payment.find(filter).sort(sortBy);
    const total = await Payment.countDocuments(filter);
    if (page && limit) query = query.skip((page - 1) * limit).limit(Number(limit));
    return { data: await query.exec(), total, page: page || 1, limit: limit || total };
  },
  async getById(id) {
    if (useDemoData()) { const i = demoStore.get(coll, id); return i ? { data: i } : null; }
    const i = await Payment.findById(id);
    return i ? { data: i } : null;
  },
  async create(body) {
    adjustParty(body);
    if (useDemoData()) return { data: demoStore.create(coll, body) };
    return { data: await Payment.create(body) };
  },
  async update(id, body) {
    if (useDemoData()) { const i = demoStore.update(coll, id, body); return i ? { data: i } : null; }
    const i = await Payment.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return i ? { data: i } : null;
  },
  async remove(id) {
    if (useDemoData()) return demoStore.remove(coll, id);
    const r = await Payment.deleteOne({ _id: id });
    return r.deletedCount > 0;
  }
};
