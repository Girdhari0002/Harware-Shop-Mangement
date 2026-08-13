import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    if (err.response?.status === 403) {
      // Forbidden — user is authenticated but not authorized. Redirect to dashboard.
      window.location.href = "/dashboard";
    }
    return Promise.reject(err);
  }
);

export default api;
