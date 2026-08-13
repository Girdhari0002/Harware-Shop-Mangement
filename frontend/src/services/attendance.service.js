import api from "./api";

export const attendanceService = {
  scan: (code) => api.post(`/attendance/scan`, { code }),
  list: (params) => api.get(`/attendance`, { params }),
  today: () => api.get(`/attendance/today`)
};
