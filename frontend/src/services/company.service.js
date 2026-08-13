import api from "./api";

export const companyService = {
  getPublic: () => api.get(`/company/public`),
  get: () => api.get(`/company`),
  update: (formData) =>
    api.put(`/company`, formData, { headers: { "Content-Type": "multipart/form-data" } })
};
