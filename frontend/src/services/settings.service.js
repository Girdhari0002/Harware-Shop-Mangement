import api from "./api";

export const settingsService = {
  list: (params) => api.get(`/settings`, { params }),
  getById: (id) => api.get(`/settings/${id}`),
  create: (payload) => api.post(`/settings`, payload),
  update: (id, payload) => api.put(`/settings/${id}`, payload),
  remove: (id) => api.delete(`/settings/${id}`),
  gatePass: (id) => api.get(`/settings/${id}/gatepass`),
  verifyGatePass: (code) => api.get(`/settings/verify/${code}`),
  importUsers: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post(`/settings/import`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  }
};
