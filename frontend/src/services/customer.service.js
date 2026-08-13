import api from "./api";

export const customerService = {
  list: (params) => api.get(`/customers`, { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (payload) => api.post(`/customers`, payload),
  update: (id, payload) => api.put(`/customers/${id}`, payload),
  remove: (id) => api.delete(`/customers/${id}`)
};
