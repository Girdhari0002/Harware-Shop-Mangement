import api from "./api";

export const invoiceService = {
  list: (params) => api.get(`/invoices`, { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (payload) => api.post(`/invoices`, payload),
  update: (id, payload) => api.put(`/invoices/${id}`, payload),
  remove: (id) => api.delete(`/invoices/${id}`),
  verify: (invoiceNumber) => api.get(`/invoices/verify/${invoiceNumber}`),
};

export default invoiceService;
