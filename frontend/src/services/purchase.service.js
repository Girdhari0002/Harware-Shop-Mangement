import api from "./api";

export const purchaseService = {
  list: (params) => api.get(`/purchases`, { params }),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (payload) => api.post(`/purchases`, payload),
  update: (id, payload) => api.put(`/purchases/${id}`, payload),
  remove: (id) => api.delete(`/purchases/${id}`)
};
