import api from "./api";

export const authService = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  changePassword: (payload) => api.post("/auth/change-password", payload)
};