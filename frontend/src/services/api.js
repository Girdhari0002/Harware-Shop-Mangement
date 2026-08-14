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
    // Only a request that actually carried a token can mean "your session expired" —
    // a bare login attempt also gets a 401 for wrong credentials, and that must stay
    // on the login form (with its inline error) instead of hard-navigating away.
    const hadToken = Boolean(err.config?.headers?.Authorization);

    if (hadToken && err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    if (hadToken && err.response?.status === 403) {
      // Forbidden — user is authenticated but not authorized. Redirect to dashboard.
      window.location.href = "/dashboard";
    }
    return Promise.reject(err);
  }
);

export default api;
