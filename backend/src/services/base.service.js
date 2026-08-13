import mongoose from "mongoose";
import { demoStore } from "../utils/demoStore.js";
import { useDemoData } from "../utils/demoData.js";

const isMongoId = (v) => v && /^[0-9a-fA-F]{24}$/.test(String(v));

export const createCrudService = (Model, collection, { populate = [], searchFields = [], uniqueFields = [] } = {}) => {
  const conflict = (body, ignoreId) => {
    if (!useDemoData()) return null;
    for (const field of uniqueFields) {
      const value = body[field];
      if (value) {
        const exists = demoStore.findOne(collection, (item) => String(item[field]) === String(value));
        if (exists && (!ignoreId || (exists._id !== ignoreId && exists.id !== ignoreId))) return `${Model.modelName || collection} already exists with ${field} '${value}'`;
      }
    }
    return null;
  };

  const resolve = (id) => (useDemoData() ? demoStore.get(collection, id) : Model.findById(id));
  const applyPopulate = (q) => { if (populate.length) q.populate(populate.join(" ")); return q; };

  return {
    async list({ search, sortBy = "-createdAt", page, limit } = {}) {
      const srch = search && searchFields.length ? String(search).toLowerCase() : null;
      const filterFn = (item) => !srch || searchFields.some((f) => String(item[f] || "").toLowerCase().includes(srch));
      const filterObj = srch ? { $or: searchFields.map((f) => ({ [f]: { $regex: search, $options: "i" } })) } : {};
      const sortField = sortBy.replace("-", "");
      const sortOrder = sortBy.startsWith("-") ? -1 : 1;
      if (useDemoData()) return demoStore.list(collection, { filter: filterFn, sortBy: sortField, sortOrder, page, limit });
      let query = applyPopulate(Model.find(filterObj)).sort(sortBy);
      const total = await Model.countDocuments(filterObj);
      if (page && limit) query = query.skip((page - 1) * limit).limit(Number(limit));
      return { data: await query.exec(), total, page: page || 1, limit: limit || total };
    },

    async getById(id) {
      if (useDemoData()) { const item = demoStore.get(collection, id); return item ? { data: item } : null; }
      const item = await applyPopulate(Model.findById(id)).exec();
      return item ? { data: item } : null;
    },

    async create(body) {
      const c = conflict(body);
      if (c) { const e = new Error(c); e.statusCode = 409; throw e; }
      if (useDemoData()) return { data: demoStore.create(collection, body) };
      return { data: await Model.create(body) };
    },

    async update(id, body) {
      const c = conflict(body, id);
      if (c) { const e = new Error(c); e.statusCode = 409; throw e; }
      if (useDemoData()) { const item = demoStore.update(collection, id, body); return item ? { data: item } : null; }
      const item = await applyPopulate(Model.findByIdAndUpdate(id, body, { new: true, runValidators: true })).exec();
      return item ? { data: item } : null;
    },

    async remove(id) {
      if (useDemoData()) return demoStore.remove(collection, id);
      const r = await Model.deleteOne({ _id: id });
      return r.deletedCount > 0;
    }
  };
};

export { isMongoId };
