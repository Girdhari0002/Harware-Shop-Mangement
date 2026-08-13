import api from "./api";

export const saleService = {
  list: (params) => api.get(`/sales`, { params }),
  getById: (id) => api.get(`/sales/${id}`),
  create: (payload) => api.post(`/sales`, payload),
  update: (id, payload) => api.put(`/sales/${id}`, payload),
  remove: (id) => api.delete(`/sales/${id}`),
  invoice: (id) => api.get(`/sales/${id}/invoice`)
};
