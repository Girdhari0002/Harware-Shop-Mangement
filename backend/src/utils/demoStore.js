const collections = new Map();

const findIndex = (arr, predicate) => {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
};

const ensure = (name) => {
  if (!collections.has(name)) collections.set(name, []);
  return collections.get(name);
};

const now = () => new Date().toISOString();

export const demoStore = {
  reset() {
    for (const key of collections.keys()) collections.set(key, []);
  },

  seed(name, items = []) {
    const col = ensure(name);
    for (const item of items) {
      col.push({
        ...item,
        _id: item._id ?? item.id ?? `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        id: item.id ?? item._id ?? `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      });
    }
  },

  list(name, { filter = () => true, sortBy = "createdAt", sortOrder = -1, page, limit } = {}) {
    const col = ensure(name);
    let rows = col.filter((item) => filter(item));
    rows = rows.sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      if (av < bv) return -sortOrder;
      if (av > bv) return sortOrder;
      return 0;
    });
    const total = rows.length;
    if (page && limit) {
      const start = (page - 1) * limit;
      rows = rows.slice(start, start + limit);
    }
    return { data: rows, total, page: page || 1, limit: limit || total };
  },

  findAll(name, { filter = () => true, sortBy = "createdAt", sortOrder = -1 } = {}) {
    const col = ensure(name);
    return col.filter((item) => filter(item)).sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      if (av < bv) return -sortOrder;
      if (av > bv) return sortOrder;
      return 0;
    });
  },

  get(name, id) {
    const col = ensure(name);
    return col.find((item) => item._id === id || item.id === id) || null;
  },

  findOne(name, predicate) {
    const col = ensure(name);
    return col.find((item) => predicate(item)) || null;
  },

  create(name, data) {
    const col = ensure(name);
    const ts = now();
    const item = {
      ...data,
      _id: data._id ?? `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      id: data.id ?? data._id ?? `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: data.createdAt ?? ts,
      updatedAt: data.updatedAt ?? ts
    };
    col.unshift(item);
    return { ...item };
  },

  update(name, id, data) {
    const col = ensure(name);
    const index = findIndex(col, (item) => item._id === id || item.id === id);
    if (index === -1) return null;
    const existing = col[index];
    const updated = { ...existing, ...data, _id: existing._id, id: existing.id, createdAt: existing.createdAt, updatedAt: now() };
    col[index] = updated;
    return { ...updated };
  },

  remove(name, id) {
    const col = ensure(name);
    const index = findIndex(col, (item) => item._id === id || item.id === id);
    if (index === -1) return false;
    col.splice(index, 1);
    return true;
  },

  count(name, predicate = () => true) {
    return ensure(name).filter(predicate).length;
  },

  collectionNames() {
    return Array.from(collections.keys());
  },

  dump() {
    const out = {};
    for (const name of collections.keys()) {
      out[name] = collections.get(name).map((d) => ({ ...d }));
    }
    return out;
  },

  load(data) {
    this.reset();
    for (const name of Object.keys(data || {})) {
      ensure(name);
      for (const item of data[name]) {
        collections.get(name).push({ ...item });
      }
    }
    return this.dump();
  }
};
