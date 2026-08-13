import api from "./api";

export const paymentService = {
  list: (params) => api.get(`/payments`, { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (payload) => api.post(`/payments`, payload),
  update: (id, payload) => api.put(`/payments/${id}`, payload),
  remove: (id) => api.delete(`/payments/${id}`)
};
