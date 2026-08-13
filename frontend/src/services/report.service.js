import api from "./api";

export const reportService = {
  sales: (params) => api.get(`/reports/sales`, { params }),
  purchases: (params) => api.get(`/reports/purchases`, { params }),
  gst: (params) => api.get(`/reports/gst`, { params }),
  stock: () => api.get(`/reports/stock`),
  profit: (params) => api.get(`/reports/profit`, { params }),
  topProducts: (params) => api.get(`/reports/top-products`, { params }),
  bestCustomers: (params) => api.get(`/reports/best-customers`, { params }),
  customerLedger: (id) => api.get(`/reports/customer-ledger/${id}`),
  supplierLedger: (id) => api.get(`/reports/supplier-ledger/${id}`)
};
