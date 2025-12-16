import axios from "axios";

const BASE_URL = "http://localhost:3000"; // backend

// 🔐 COMMON CONFIG (VERY IMPORTANT)
const axiosConfig = {
  withCredentials: true, // 🔥 SEND COOKIES
};

// ================= DASHBOARD =================
export const dashboardApi = axios.create({
  baseURL: `${BASE_URL}/dashboard`,
  ...axiosConfig,
});

// ================= USER =================
export const userApi = axios.create({
  baseURL: `${BASE_URL}/user`,
  ...axiosConfig,
});

// ================= COMPANY =================
export const companyApi = axios.create({
  baseURL: `${BASE_URL}/company`,
  ...axiosConfig,
});

// ================= JOBS =================
export const jobsApi = axios.create({
  baseURL: `${BASE_URL}/jobs`,
  ...axiosConfig,
});

// ================= RESUME =================
export const resumeApi = axios.create({
  baseURL: `${BASE_URL}/resume`,
  ...axiosConfig,
});

// ================= APPLICATION =================
export const applicationApi = axios.create({
  baseURL: `${BASE_URL}/application`,
  ...axiosConfig,
});
