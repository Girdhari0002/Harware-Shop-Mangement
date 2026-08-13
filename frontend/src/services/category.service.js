import api from "./api";

export const categoryService = {
  list: (params) => api.get(`/categories`, { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (payload) => api.post(`/categories`, payload),
  update: (id, payload) => api.put(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`)
};
