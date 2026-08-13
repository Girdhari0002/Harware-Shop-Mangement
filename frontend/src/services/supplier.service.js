import api from "./api";

export const supplierService = {
  list: (params) => api.get(`/suppliers`, { params }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (payload) => api.post(`/suppliers`, payload),
  update: (id, payload) => api.put(`/suppliers/${id}`, payload),
  remove: (id) => api.delete(`/suppliers/${id}`)
};
