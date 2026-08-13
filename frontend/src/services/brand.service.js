import api from "./api";

export const brandService = {
  list: (params) => api.get(`/brands`, { params }),
  getById: (id) => api.get(`/brands/${id}`),
  create: (payload) => api.post(`/brands`, payload),
  update: (id, payload) => api.put(`/brands/${id}`, payload),
  remove: (id) => api.delete(`/brands/${id}`)
};
