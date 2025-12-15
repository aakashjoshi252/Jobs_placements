import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const dashboardApi = axios.create({
  baseURL: `${BASE_URL}/dashboard`,
  withCredentials: true, // ✅ send cookies
});
// ================= USER =================
export const userApi = axios.create({
  baseURL: `${BASE_URL}/user`,
  withCredentials: true, // ✅ send cookies
});

// ================= COMPANY =================
export const companyApi = axios.create({
  baseURL: `${BASE_URL}/company`,
  withCredentials: true, // ✅ REQUIRED
});

// ================= JOBS =================
export const jobsApi = axios.create({
  baseURL: `${BASE_URL}/jobs`,
  withCredentials: true,
});

// ================= RESUME =================
export const resumeApi = axios.create({
  baseURL: `${BASE_URL}/resume`,
  withCredentials: true,
});

// ================= APPLICATION =================
export const applicationApi = axios.create({
  baseURL: `${BASE_URL}/applications`,
  withCredentials: true,
});
